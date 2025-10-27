// db.ts - APENAS QUERIES REAIS, SEM MOCK, SEM DEBUG
import { Pool } from 'pg';

let pool: Pool | undefined;

function getPool() {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('A variável de ambiente POSTGRES_URL ou DATABASE_URL não está definida.');
    }
    pool = new Pool({ connectionString });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  
  if (process.env.NEXT_PHASE === 'phase-production-build' && !process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
    return { rows: [], rowCount: 0 };
  }
  
  try {
    const res = await getPool().query(text, params);
    const duration = Date.now() - start;
    console.log('[v0] Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

// FUNÇÕES DO DASHBOARD - EXATAMENTE COMO NA PÁGINA DE SERVIÇOS
export async function getDashboardStats() {
  const result = await query(`
    WITH service_coverage AS (
      SELECT
        s.id,
        COALESCE(
          (COUNT(DISTINCT t.test_case_id)::float / NULLIF(COUNT(DISTINCT tc.id), 0) * 100), 0
        ) as coverage
      FROM services s
      LEFT JOIN test_cases tc ON s.id = tc.service_id
      LEFT JOIN tests t ON tc.id = t.test_case_id
      GROUP BY s.id
    )
    SELECT
      (SELECT COUNT(*) FROM tests WHERE result <> 'pendente') as total_tests,
      (SELECT COUNT(*) FROM bugs WHERE status IN ('open', 'in_progress')) as open_bugs,
      (SELECT COUNT(*) FROM test_cases) as total_test_cases,
      (SELECT COUNT(*) FROM services) as total_services,
      (SELECT AVG(coverage) FROM service_coverage) as average_coverage
  `);

  const data = result.rows[0] || {};
  
  return {
    totalTests: parseInt(data.total_tests || '0', 10),
    openBugs: parseInt(data.open_bugs || '0', 10),
    totalTestCases: parseInt(data.total_test_cases || '0', 10),
    averageCoverage: Math.round(parseFloat(data.average_coverage || '0')),
    totalServices: parseInt(data.total_services || '0', 10),
  };
}

export async function getTestsByType() {
  const result = await query(`
    SELECT 
      LOWER(TRIM(type)) as type, 
      COUNT(*) as count
    FROM tests 
    WHERE type IS NOT NULL AND TRIM(type) <> ''
    GROUP BY LOWER(TRIM(type))
    ORDER BY count DESC
  `);
  
  return result.rows.map((row: any) => ({
    type: row.type,
    count: parseInt(row.count, 10),
  }));
}

export async function getTestsByResult() {
  const result = await query(`
    SELECT 
      LOWER(TRIM(result)) as result, 
      COUNT(*) as count
    FROM tests 
    WHERE result IS NOT NULL AND TRIM(result) <> ''
    GROUP BY LOWER(TRIM(result))
    ORDER BY count DESC
  `);
  
  return result.rows.map((row: any) => ({
    result: row.result,
    count: parseInt(row.count, 10),
  }));
}

export async function getTestsStatusByService() {
  const result = await query(`
    SELECT
      s.name as service,
      t.result as status,
      COUNT(t.id) as count
    FROM tests t
    JOIN test_cases tc ON t.test_case_id = tc.id
    JOIN services s ON tc.service_id = s.id
    WHERE t.result IS NOT NULL AND TRIM(t.result) <> ''
    GROUP BY s.name, t.result
    ORDER BY s.name, t.result;
  `);

  if (result.rows.length === 0) {
    return { data: [], services: [] };
  }

  const services = [...new Set(result.rows.map((row: any) => row.service))];
  const statuses = [...new Set(result.rows.map((row: any) => row.status))];

  const pivotedData = statuses.map(status => {
    const row: { status: string; [service: string]: number | string } = { status };

    services.forEach(service => {
      row[service] = 0;
    });

    result.rows
      .filter((r: any) => r.status === status)
      .forEach((r: any) => {
        row[r.service] = parseInt(r.count, 10);
      });

    return row;
  });

  return {
    data: pivotedData,
    services: services,
  };
}

export async function getCoverageByService() {
  const result = await query(`
    SELECT
      s.name as service,
      COALESCE(
        (
          SELECT (COUNT(DISTINCT t.test_case_id)::float / NULLIF(COUNT(DISTINCT tc.id), 0) * 100)
          FROM test_cases tc
          LEFT JOIN tests t ON t.test_case_id = tc.id AND t.result = 'aprovado'
          WHERE tc.service_id = s.id
        ), 0.0
      )::int as coverage
    FROM services s
    ORDER BY s.name
  `);
  
  return result.rows.map((row: any) => ({
    service: row.service,
    coverage: parseInt(row.coverage, 10) || 0,
  }));
}

export async function getFunnelData() {
  const result = await query(`
    SELECT
      (SELECT COUNT(*) FROM test_cases) AS test_cases_count,
      (SELECT COUNT(*) FROM tests) AS tests_count,
      (SELECT COUNT(*) FROM tests WHERE result = 'aprovado') AS passed_count,
      (SELECT COUNT(*) FROM bugs WHERE status IN ('open', 'in_progress')) AS bugs_count
  `);

  const data = result.rows[0] || {};

  return [
    {
      stage: 'Casos de Teste',
      value: parseInt(data.test_cases_count || '0', 10),
    },
    {
      stage: 'Testes Executados',
      value: parseInt(data.tests_count || '0', 10),
    },
    {
      stage: 'Testes Aprovados',
      value: parseInt(data.passed_count || '0', 10),
    },
    {
      stage: 'Bugs Encontrados',
      value: parseInt(data.bugs_count || '0', 10),
    },
  ];
}

export async function getAlerts() {
  const criticalBugs = await query(`
    SELECT id, name, description, created_at,
           EXTRACT(DAY FROM NOW() - created_at) as days_open
    FROM bugs
    WHERE status IN ('open', 'in_progress')
      AND criticality = 'critica'
      AND EXTRACT(DAY FROM NOW() - created_at) > 7
    ORDER BY days_open DESC
    LIMIT 5
  `);

  const staleTests = await query(`
    SELECT id, name, description, updated_at,
           EXTRACT(DAY FROM NOW() - updated_at) as days_stale
    FROM tests
    WHERE EXTRACT(DAY FROM NOW() - updated_at) > 30
    ORDER BY days_stale DESC
    LIMIT 5
  `);

  return [
    ...criticalBugs.rows.map((bug: any) => ({
      id: Number(bug.id),
      type: 'bug' as const,
      severity: 'critical' as const,
      title: `Bug crítico não resolvido há ${Math.floor(bug.days_open)} dias`,
      description: bug.name,
      item_id: Number(bug.id),
      days_open: Number(bug.days_open),
      created_at: bug.created_at ? new Date(bug.created_at).toISOString() : null,
    })),
    ...staleTests.rows.map((test: any) => ({
      id: Number(test.id),
      type: 'test' as const,
      severity: 'warning' as const,
      title: `Teste sem atualização há ${Math.floor(test.days_stale)} dias`,
      description: test.name,
      item_id: Number(test.id),
      days_open: Number(test.days_stale),
      updated_at: test.updated_at ? new Date(test.updated_at).toISOString() : null,
    })),
  ];
}

export async function getRecentActivities() {
  const result = await query(`
    SELECT 
      'test' as type, 
      name as title, 
      description, 
      created_at,
      id
    FROM tests
    WHERE name IS NOT NULL
    UNION ALL
    SELECT 
      'bug' as type, 
      name as title, 
      description, 
      created_at,
      id
    FROM bugs
    WHERE name IS NOT NULL
    UNION ALL
    SELECT 
      'test_case' as type, 
      name as title, 
      COALESCE(observations, '') as description, 
      created_at,
      id
    FROM test_cases
    WHERE name IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 10
  `);
  
  return result.rows.map((row: any) => ({
    ...row,
    id: Number(row.id),
    created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
  }));
}

// Funções auxiliares (mantidas para outras páginas)
export async function getAllServicesForSelect() {
  const result = await query('SELECT id, name FROM services WHERE name IS NOT NULL ORDER BY name');
  return result.rows;
}

export async function getAllTestsForSelect() {
  const result = await query('SELECT id, name FROM tests WHERE name IS NOT NULL ORDER BY name');
  return result.rows;
}

export async function getTestCases() {
  const result = await query(`
    SELECT 
      tc.*,
      s.name as service_name
    FROM test_cases tc
    JOIN services s ON tc.service_id = s.id
    ORDER BY tc.id DESC
  `);
  return result.rows.map((row: any) => ({
    ...row,
    id: Number(row.id),
    service_id: Number(row.service_id),
  }));
}

export async function getAllImprovementsForExport() {
  const result = await query('SELECT * FROM improvements ORDER BY id DESC');
  return result.rows;
}

export async function getAllServicesForExport() {
  const result = await query('SELECT * FROM services ORDER BY id DESC');
  return result.rows;
}

export async function getAllBugsForExport() {
  const result = await query('SELECT * FROM bugs ORDER BY id DESC');
  return result.rows;
}

export async function getAllTestCasesForExport() {
  const result = await query('SELECT * FROM test_cases ORDER BY id DESC');
  return result.rows;
}

export async function getAllTestsForExport() {
  const result = await query('SELECT * FROM tests ORDER BY id DESC');
  return result.rows;
}

export async function getAllPerformanceForExport() {
  const result = await query('SELECT * FROM performance_plans ORDER BY id DESC');
  return result.rows;
}