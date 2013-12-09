/**
 * Author: G@mOBEP
 * Date: 27.12.12
 * Time: 1:03
 *
 * Набор модулей Swift.
 */

var $fs = require('fs'),
    $path = require('path'),

    $async = require('async'),

    $swiftUtils = require('swift.utils'),

    Module = require('./module').Module;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ModuleManager ()
{
    /**
     * Путь к директории модулей
     *
     * @type {String|null}
     * @private
     */
    this._pathToModules = null;

    /**
     * Слушатель запросов
     *
     * @type {Object|null}
     * @private
     */
    this._requestListener = null;

    /**
     * Маршруты (объект вида:
     *     {
     *         ModuleName1: {
     *             'controllerName1': {
     *                 'actionName1': ['path1'],
     *                 'actionName2': ['path2'],
     *                 ...
     *                 'actionNameN': ['pathN']
     *             },
     *             ...
     *             'controllerNameN': {
     *                 ...
     *             }
     *         },
     *         ...
     *         ModuleNameN :{
     *             ...
     *         }
     *     }
     * )
     *
     * @type {Object}
     * @private
     */
    this._routes = {};

    /**
     * Модули
     *
     * @type {Object}
     * @private
     */
    this._modules = {};
}

/**
 * Задание пути к директории модулей
 *
 * @param {String} path
 *
 * @returns {ModuleManager}
 */
ModuleManager.prototype.setPathToModules = function setPathToModules (path)
{
    this._pathToModules = $path.normalize(path);

    return this;
};

/**
 * Получение пути к директории модулей
 *
 * @returns {String}
 */
ModuleManager.prototype.getPathToModules = function getPathToModules ()
{
    return this._pathToModules;
};

/**
 * Задание слушателя запросов
 *
 * @param {Object} requestListener слушатель запросов
 *
 * @returns {ModuleManager}
 */
ModuleManager.prototype.setRequestListener = function setRequestListener (requestListener)
{
    this._requestListener = requestListener;

    return this;
};

/**
 * Получение слушателя запросов
 *
 * @returns {Object}
 */
ModuleManager.prototype.getRequestListener = function getRequestListener ()
{
    return this._requestListener;
};

/**
 * Задание маршрутов
 *
 * @param {Object} routes
 *
 * @returns {ModuleManager}
 */
ModuleManager.prototype.setRoutes = function setRoutes (routes)
{
    this._routes = routes;

    return this;
};

/**
 * Добавление маршрута
 *
 * @param {String} moduleName название модуля
 * @param {String} controllerName название контроллера
 * @param {String} actionName название экшена
 * @param {String|RegExp} path путь
 *
 * @returns {ModuleManager}
 */
ModuleManager.prototype.addRoute = function addRoute (moduleName, controllerName, actionName, path)
{
    this._routes[moduleName]                 = this._routes[moduleName] || {};
    this._routes[moduleName][controllerName] = this._routes[moduleName][controllerName] || {};

    if (typeof path === 'string')
    {
        (this._routes[moduleName][controllerName][actionName] = this._routes[moduleName][controllerName][actionName] || []).push(path);
    }
    else
    {
        this._routes[moduleName][controllerName][actionName] = (this._routes[moduleName][controllerName][actionName] || []).concat(path);
    }

    return this;
};

/**
 * Получение маршрутов
 *
 * @returns {Object}
 */
ModuleManager.prototype.getRoutes = function getRoutes ()
{
    return this._routes;
};

/**
 * Добавление модуля
 *
 * @param {Module} modul
 *
 * @returns {ModuleManager}
 */
ModuleManager.prototype.addModule = function addModule (modul)
{
    this._modules[modul.getName()] = modul;

    return this;
};

/**
 * Загрузка модуля
 *
 * @param {String} moduleName название модуля
 *
 * @returns {ModuleManager}
 */
ModuleManager.prototype.loadModule = function loadModule (moduleName)
{
    var pathToModule = this._pathToModules + '/' + moduleName.split('.').join('/modules/');

    this.addModule(new Module()
        .setName(moduleName)
        .setPathToModule(pathToModule)
        .setRequestListener(this._requestListener)
        .setRoutes(this._routes[moduleName] || {}));

    return this;
};

/**
 * Получение модуля
 *
 * @param {String|null} moduleName название модуля
 *
 * @return {ModuleManager}
 */
ModuleManager.prototype.getModule = function getModule (moduleName)
{
    return (this._modules[moduleName] || null);
};

/**
 * Получение всех модулей
 *
 * @returns {Object}
 */
ModuleManager.prototype.getAllModules = function getAllModules ()
{
    return this._modules;
};

/**
 * Запуск модулей
 *
 * @param {Function|undefined} cb
 *
 * @returns {ModuleManager}
 */
ModuleManager.prototype.run = function run (cb)
{
    var self = this;

    if (!cb)
    {
        cb = function(){};
    }

    $async.each(Object.keys(this._routes), function (moduleName, stop)
    {
        var modul = self._modules[moduleName];

        if (modul == null)
        {
            stop(null);
            return;
        }

        modul.run(function (err)
        {
            stop(err);
        });
    }, function (err)
    {
        cb(err);
    });

    return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.ModuleManager = ModuleManager;