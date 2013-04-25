/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:59
 */

var $util = require('util'),

    SwiftModulesError = require('../error').SwiftModulesError;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ModuleError (message, details)
{
    SwiftModulesError.call(this, 'Module: ' + message, details);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'swift.modules:ModuleError';
}
$util.inherits(ModuleError, SwiftModulesError);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// static
//

ModuleError.codes = {
    ACTION_NOT_FOUND:                'ACTION_NOT_FOUND',
    BAD_ACTION_NAME:                 'BAD_ACTION_NAME',
    BAD_CONTROLLER_NAME:             'BAD_CONTROLLER_NAME',
    BAD_NAME:                        'BAD_NAME',
    BAD_PATH:                        'BAD_PATH',
    BAD_PATH_TO_CONTROLLERS:         'BAD_PATH_TO_VIEWS',
    BAD_PATH_TO_MODELS:              'BAD_PATH_TO_MODELS',
    BAD_PATH_TO_MODULE:              'BAD_PATH_TO_MODULE',
    BAD_PATH_TO_VIEWS:               'BAD_PATH_TO_VIEWS',
    BAD_REQUEST_LISTENER:            'BAD_REQUEST_LISTENER',
    BAD_ROUTES:                      'BAD_ROUTES',
    CONTROLLER_NOT_FOUND:            'CONTROLLER_NOT_FOUND',
    CONTROLLERS_DIRECTORY_NOT_FOUND: 'CONTROLLERS_DIRECTORY_NOT_FOUND',
    MODELS_DIRECTORY_NOT_FOUND:      'MODELS_DIRECTORY_NOT_FOUND',
    MODULE_ALREADY_RUN:              'MODULE_ALREADY_RUN',
    MODULE_DIRECTORY_NOT_FOUND:      'MODULE_DIRECTORY_NOT_FOUND',
    UNKNOWN_REQUEST_LISTENER:        'UNKNOWN_REQUEST_LISTENER',
    VIEWS_DIRECTORY_NOT_FOUND:       'VIEWS_DIRECTORY_NOT_FOUND'
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.ModuleError = ModuleError;