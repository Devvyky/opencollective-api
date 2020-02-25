'use strict';

/**
 * When created, the `type` column of `ExpenseHistories` used a different ENUM than
 * `Expenses`. This would have been a problem if we ever decided to edit this enum and
 * `test/server/models/models-histories` didn't like it.
 */
module.exports = {
  up: queryInterface => {
    return queryInterface.sequelize.query(`
      START TRANSACTION;

      ALTER TABLE "ExpenseHistories"
        -- Drop the default (otherwise values convertion will not work)
        ALTER COLUMN "type"
          DROP DEFAULT,
        -- Move histories to standard enum
        ALTER COLUMN "type"
          TYPE "enum_Expenses_type"
          USING "type"::text::"enum_Expenses_type",
        -- Restaure default
        ALTER COLUMN "type"
          SET DEFAULT 'UNCLASSIFIED';

      -- Drop old enum
      DROP TYPE "enum_ExpenseHistories_type";

      COMMIT;
    `);
  },

  down: queryInterface => {
    return queryInterface.sequelize.query(`
      START TRANSACTION;

      -- Re-create old enum
      CREATE TYPE "enum_ExpenseHistories_type" AS ENUM ('RECEIPT', 'INVOICE', 'UNCLASSIFIED');

      ALTER TABLE "ExpenseHistories"
        -- Drop the default (otherwise values convertion will not work)
        ALTER COLUMN "type"
          DROP DEFAULT,
        -- Move histories to old enum
        ALTER COLUMN "type"
          TYPE "enum_ExpenseHistories_type"
          USING "type"::text::"enum_ExpenseHistories_type",
        -- Restaure default
        ALTER COLUMN "type"
          SET DEFAULT 'UNCLASSIFIED';

      COMMIT;
    `);
  },
};
