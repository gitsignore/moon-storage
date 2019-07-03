const { checkSchema } = require('express-validator');

const teamSchema = ({ checkId, onlyId } = { checkId: true, onlyId: false }) => {
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
    schema.backgroundUrl = {
      exists: {
        errorMessage: 'backgroundUrl key should exists'
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
    schema.teamId = {
      in: ['params', 'query'],
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

module.exports = teamSchema;
