const { checkSchema } = require('express-validator/check');

const userSchema = ({ checkId, onlyId } = { checkId: true, onlyId: false }) => {
  const schema = {};

  if (!onlyId) {
    schema.name = {
      exists: {
        errorMessage: 'name key should exists'
      },
      isLength: {
        errorMessage: 'name should be at least 1 char long',
        options: { min: 1 }
      }
    };
    schema.avatar = {
      exists: {
        errorMessage: 'avatar key should exists'
      },
      isString: {
        errorMessage: 'avatar should be a string'
      }
    };
    schema.status = {
      exists: {
        errorMessage: 'status key should exists'
      },
      isString: {
        errorMessage: 'status should be a string'
      },
      isIn: {
        options: [['online', 'busy', 'away', 'offline']],
        errorMessage: 'status should have one of these values : online, busy, away or offline'
      }
    };
    schema.location = {
      trim: true,
      exists: {
        errorMessage: 'Location key should exists'
      }
    };
    schema.message = {
      exists: {
        errorMessage: 'message key should exists'
      }
    };
    schema.focus_time = {
      exists: {
        errorMessage: 'focus_time key should exists'
      }
    };
  }

  if (checkId || onlyId) {
    schema.userId = {
      in: ['params', 'query', 'body'],
      errorMessage: 'User ID is wrong',
      exists: {
        errorMessage: 'User ID key should exists'
      },
      isLowercase: {
        errorMessage: 'User ID should be lowercase'
      },
      isLength: {
        errorMessage: 'User ID should be at least 1 char long',
        options: { min: 1 }
      }
    };

    schema.teamId = {
      in: ['params', 'query', 'body'],
      errorMessage: 'Team ID is wrong',
      exists: {
        errorMessage: 'Team ID key should exists'
      },
      isLowercase: {
        errorMessage: 'Team ID should be lowercase'
      },
      isLength: {
        errorMessage: 'Team ID should be at least 1 char long',
        options: { min: 1 }
      }
    };
  }

  return checkSchema(schema);
};

module.exports = userSchema;
