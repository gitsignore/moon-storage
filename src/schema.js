const { checkSchema } = require('express-validator');

exports.teamSchema = (
  { checkId, onlyId } = { checkId: true, onlyId: false }
) => {
  const schema = {};

  if (!onlyId) {
    schema.name = {
      isLength: {
        errorMessage: 'Name should be at least 1 char long',
        options: { min: 1 }
      },
      customSanitizer: {
        options: value => value.toLowerCase()
      }
    };
    schema.avatar = {
      exists: {
        errorMessage: 'Avatar key should exists'
      }
    };
    schema.message = {
      exists: {
        errorMessage: 'Message key should exists'
      }
    };
    schema.users = {
      exists: {
        errorMessage: 'Users key should exists'
      },
      isArray: {
        errorMessage: 'Users should be an array'
      }
    };
  }

  if (checkId || onlyId) {
    schema.id = {
      in: ['params', 'query'],
      errorMessage: 'ID is wrong',
      exists: {
        errorMessage: 'ID key should exists'
      },
      isLowercase: {
        errorMessage: 'ID should be lowercase'
      },
      isLength: {
        errorMessage: 'ID should be at least 1 char long',
        options: { min: 1 }
      }
    };
  }

  return checkSchema(schema);
};

exports.userSchema = (
  { checkId, onlyId } = { checkId: true, onlyId: false }
) => {
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
        errorMessage:
          'status should have one of these values : online, busy, away or offline'
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
    schema.id = {
      in: ['params', 'query', 'body'],
      errorMessage: 'id is wrong',
      exists: {
        errorMessage: 'id key should exists'
      },
      isLowercase: {
        errorMessage: 'id should be lowercase'
      },
      isLength: {
        errorMessage: 'id should be at least 1 char long',
        options: { min: 1 }
      }
    };
  }

  return checkSchema(schema);
};
