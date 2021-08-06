import { QueryRunner } from 'typeorm';

/**
 * Gera um SQL de inserção apartir de um objeto JSON
 * @param param0
 */
export function JsonToSQL({ table = '', data = [] }) {
  const fieldNames = Object.keys(data[0]).map(f => f);
  const dataParams = data
    .map((row, ri) =>
      Object.keys(row)
        .map((f, fi, list) => `$${(ri * list.length + fi) + 1}`)
        .join(', '),
    )
    .join('),(');

  return {
    sql: `INSERT INTO "${table}" (${fieldNames.join(
      ',',
    )}) VALUES (${dataParams})`,
    params: [].concat(...data.map(row => Object.values(row))),
  };
}

/**
 * Cria uma função para inserir JSON
 * @param runner
 */
export const createQueryRunnerInsert = (runner: QueryRunner) => (data: {
  table: string;
  data: any[];
}) => {
  const { sql, params } = JsonToSQL(data);
  return runner.query(sql, params);
};

/**
 * Cria uma função para excluir JSON
 * @param runner
 */
export const createQueryRunnerDelete = (runner: QueryRunner) => (
  data: { table: string; data: any[] },
  pk = 'id',
) => {
  const ids = data.data.map(r => r[pk]);
  return runner.query(
    `DELETE FROM "${data.table}" WHERE "${pk}" in (${ids.join(',')})`,
  );
};
