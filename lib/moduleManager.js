/**
 * Author: G@mOBEP
 * Date: 27.12.12
 * Time: 1:03
 *
 * Набор модулей Swift.
 */

var $fs = require('fs'),
    $path = require('path'),

    $swiftErrors = require('swift.errors'),
    $swiftUtils = require('swift.utils'),

    immediate = typeof setImmediate === 'function' ? setImmediate : process.nextTick,

    Module = require('./module').Module;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ModuleManager ()
{
    /**
     * Флаг запущенного набора
     *
     * @type {Boolean}
     * @private
     */
    this._isRun = false;

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
     *                 'actionName1': 'path1',
     *                 'actionName2': 'path2',
     *                 ...
     *                 'actionNameN': 'pathN'
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
 * @param {String} pathToModules
 *
 * @returns {ModuleManager}
 */
ModuleManager.prototype.setPathToModules = function setPathToModules (pathToModules)
{
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('Модули уже запущены.');
    if (typeof pathToModules !== 'string')
        throw new $swiftErrors.TypeError('Недопустимый тип пути к директории модулей (ожидается: "string", принято: "' + typeof pathToModules + '").');
    if (!pathToModules.length)
        throw new $swiftErrors.ValueError('Недопустимое значение пути к к директории модулей.');
    if (!$swiftUtils.fs.existsSync(pathToModules) || !$fs.statSync(pathToModules).isDirectory())
        throw new $swiftErrors.SystemError('Директория "' + pathToModules + '" не найдена.');
    //
    // задание пути к директории модулей
    //
    this._pathToModules = $path.normalize(pathToModules);

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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('Модули уже запущены.');
    if (typeof requestListener !== 'function')
        throw new $swiftErrors.TypeError('Недопустимый тип слушателя запросов (ожидается: "function", принято: "' + typeof requestListener + '").');
    if (typeof requestListener.get !== 'function' || typeof requestListener.post !== 'function' ||
        typeof requestListener.put !== 'function' || typeof requestListener.delete !== 'function')
        throw new $swiftErrors.ValueError('Неизвестный слушатель запросов.');
    //
    // задание слушателя запросов
    //
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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('Модули уже запущены.');
    if (!$swiftUtils.type.isObject(routes))
        throw new $swiftErrors.TypeError('Недопустимый тип пути маршрутов (ожидается: "object", принято: "' + typeof routes + '").');
    //
    // задание маршрутов
    //
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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('Модули уже запущены.');
    if (typeof moduleName !== 'string')
        throw new $swiftErrors.TypeError('Недопустимый тип имени модуля (ожидается: "string", принято: "' + typeof moduleName + '").');
    if (!moduleName.length)
        throw new $swiftErrors.ValueError('Недопустимое значение имени модуля.');
    if (typeof controllerName !== 'string')
        throw new $swiftErrors.TypeError('Недопустимый тип имени контроллера (ожидается: "string", принято: "' + typeof controllerName + '").');
    if (!controllerName.length)
        throw new $swiftErrors.ValueError('Недопустимое значение имени контроллера.');
    if (typeof actionName !== 'string')
        throw new $swiftErrors.TypeError('Недопустимый тип имени экшена (ожидается: "string", принято: "' + typeof actionName + '").');
    if (!actionName.length)
        throw new $swiftErrors.ValueError('Недопустимое значение имени экшена.');
    if (typeof path !== 'string')
        throw new $swiftErrors.TypeError('Недопустимый тип пути (ожидается: "string", принято: "' + typeof path + '").');
    if (!path.length)
        throw new $swiftErrors.ValueError('Недопустимое значение пути.');
    //
    // добавление маршрута
    //
    this._routes[moduleName]                             = this._routes[moduleName] || {};
    this._routes[moduleName][controllerName]             = this._routes[moduleName][controllerName] || {};
    this._routes[moduleName][controllerName][actionName] = this._routes[moduleName][controllerName][actionName] || path;

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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('Модули уже запущены.');
    if (!(modul instanceof Module))
        throw new $swiftErrors.TypeError('Недопустимый тип модуля (ожидается: "Module", принято: "' + typeof modul + '").');
    //
    // добавление модуля
    //
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
    var pathToModule,
        modul;
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('Модули уже запущены.');
    if (typeof moduleName !== 'string')
        throw new $swiftErrors.TypeError('Недопустимый тип имени модуля (ожидается: "string", принято: "' + typeof moduleName + '").');
    if (!moduleName.length)
        throw new $swiftErrors.ValueError('Недопустимое значение имени модуля.');

    pathToModule = this._pathToModules + '/' + moduleName.split('.').join('/modules/');

    if (!$swiftUtils.fs.existsSync(pathToModule) || !$fs.statSync(pathToModule).isDirectory())
        throw new $swiftErrors.SystemError('Не найдена директория модуля "' + pathToModule + '".');
    //
    // создание модуля и добавление его в набор
    //
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
    cb = cb || function () {};

    if (this._isRun)
    {
        cb(new $swiftErrors.SystemError('Модули уже запущены.'));
        return this;
    }

    var loading = 0,
        errors = [];

    this._isRun = true;
    //
    // запуск модулей
    //
    for (var moduleName in this._routes)
    {
        if (!this._routes.hasOwnProperty(moduleName)) continue;

        loading++;

        var modul = this._modules[moduleName];

        if (!modul)
        {
            errors.push(new $swiftErrors.SystemError('Модуль "' + moduleName + '" не найден.'));
            loading--;
            continue;
        }

        (function (moduleName)
        {
            modul.run(function (err)
            {
                if (err)
                {
                    if (err instanceof $swiftErrors.MultipleError) errors = errors.concat(err);
                    else errors.push(err);
                }

                loading--;
            });
        })(moduleName);
    }
    //
    // ожидание окончания запуска модулей
    //
    (function awaiting ()
    {
        immediate(function ()
        {
            if (loading)
            {
                awaiting();
                return;
            }

            if (errors.length)
            {
                cb(new $swiftErrors.MultipleError('Ошибки запуска модулей.').setList(errors));
                return;
            }

            cb(null);
        });
    })();

    return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.ModuleManager = ModuleManager;