export const selectCount = (table: string): string => {
  return `SELECT COUNT(*) AS c FROM '${table}'`;
};

export const selectRowById = (id: number, table: string): string => {
  return `SELECT * FROM ${table} WHERE id = ${id}`;
};

export const selectCategoryByTitle = (title: string): string => {
  return `SELECT id FROM categories WHERE title = '${title}'`
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  return `
  SELECT a.title AS app_title, category_id, c.title AS category_title
  FROM apps_categories ac
  JOIN apps a ON app_id = a.id
  JOIN categories c ON ac.category_id = c.id
  WHERE app_id = '${appId}'`
};

export const selectUnigueRowCount = (tableName: string, columnName: string): string => {
  return `SELECT COUNT(DISTINCT ${columnName}) AS c FROM ${tableName};`
};

export const selectReviewByAppIdAuthor = (appId: number, author: string): string => {
  return `SELECT * FROM reviews WHERE app_id = ${appId} AND author = '${author}'`
};

export const selectColumnFromTable = (columnName: string, tableName: string): string => {
  return `SELECT ${columnName} FROM ${tableName}`;
};

