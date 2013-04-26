/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:37
 */

var $util = require('util');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SwiftModulesError (message, details)
{
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.name    = 'swift.db:SwiftModulesError';
    this.message = 'swift.db ' + message;
    this.details = details || null;
    this.code    = null;
}
$util.inherits(SwiftModulesError, Error);

/**
 * Задание сообщения об ошибке
 *
 * @param {String} message сообщение об ошибке
 *
 * @returns {SwiftModulesError}
 */
SwiftModulesError.prototype.setMessage = function setMessage (message)
{
    this.message = message;
    return this;
};

/**
 * Задание деталей
 *
 * @param {*} details детали
 *
 * @returns {SwiftModulesError}
 */
SwiftModulesError.prototype.setDetails = function setMessage (details)
{
    this.details = details;
    return this;
};

/**
 * Задание кода ошибки
 *
 * @param {String} code код ошибки
 *
 * @returns {SwiftModulesError}
 */
SwiftModulesError.prototype.setCode = function setCode (code)
{
    this.code = code;
    return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.SwiftModulesError  = SwiftModulesError;
exports.ModuleManagerError = require('./moduleManagerError').ModuleManagerError;
exports.ModuleError        = require('./moduleError').ModuleError;