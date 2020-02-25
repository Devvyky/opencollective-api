import { GraphQLString } from 'graphql';

import { Expense } from '../object/Expense';
import { ExpenseReferenceInput, fetchExpenseWithInput } from '../input/ExpenseReferenceInput';

const ExpenseQuery = {
  type: Expense,
  args: {
    id: {
      type: GraphQLString,
      description: 'Public expense identifier',
      deprecationReason: '2020-02-28: Please use the `expense` field.',
    },
    expense: {
      type: ExpenseReferenceInput,
      description: 'Identifiers to retrieve the expense.',
    },
  },
  async resolve(_, args, req) {
    if (args.expense) {
      return fetchExpenseWithInput(args.expense, req);
    } else if (args.id) {
      return req.loaders.Expense.byId.load(args.id);
    } else {
      throw new Error('You must either provide an id or an expense');
    }
  },
};

export default ExpenseQuery;
