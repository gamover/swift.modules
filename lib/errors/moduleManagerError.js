/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:58
 */

var $util = require('util'),

    SwiftModulesError = require('./swiftModulesError').SwiftModulesError;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ModuleManagerError (message, details)
{
    SwiftModulesError.call(this, 'ModuleManager: ' + message, details);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'swift.db:ModuleManagerError';
}
$util.inherits(ModuleManagerError, SwiftModulesError);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// static
//

ModuleManagerError.codes = {
    BAD_ACTION_NAME:             'BAD_ACTION_NAME',
    BAD_CONTROLLER_NAME:         'BAD_CONTROLLER_NAME',
    BAD_MODULE:                  'BAD_MODULE',
    BAD_MODULE_NAME:             'BAD_MODULE_NAME',
    BAD_PATH:                    'BAD_PATH',
    BAD_PATH_TO_MODULES:         'BAD_PATH_TO_MODULES',
    BAD_REQUEST_LISTENER:        'BAD_REQUEST_LISTENER',
    BAD_ROUTES:                  'BAD_ROUTES',
    MODULE_DIRECTORY_NOT_FOUND:  'MODULE_DIRECTORY_NOT_FOUND',
    MODULE_NOT_FOUND:            'MODULE_NOT_FOUND',
    MODULES_ALREADY_RUN:         'MODULES_ALREADY_RUN',
    MODULES_DIRECTORY_NOT_FOUND: 'MODULES_DIRECTORY_NOT_FOUND',
    SYSTEM_ERROR:                'SYSTEM_ERROR',
    UNKNOWN_REQUEST_LISTENER:    'UNKNOWN_REQUEST_LISTENER'
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.ModuleManagerError = ModuleManagerError;