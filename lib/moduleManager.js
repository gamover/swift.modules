/**
 * Author: G@mOBEP
 * Date: 27.12.12
 * Time: 1:03
 *
 * Набор модулей Swift.
 */

var $fs = require('fs'),
    $path = require('path'),
    $swiftUtils = require('swift.utils'),

    immediate = typeof setImmediate === 'function' ? setImmediate : process.nextTick,

    ModuleManagerError = require('./errors/moduleManagerError').ModuleManagerError,
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
     * @type {String}
     * @private
     */
    this._pathToModules = null;

    /**
     * Слушатель запросов
     *
     * @type {Object}
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
    if (this._isRun)
        throw new ModuleManagerError()
            .setMessage('Не удалось задать путь к директории модулей. Модули уже запущены')
            .setCode(ModuleManagerError.codes.MODULES_ALREADY_RUN);
    if (typeof pathToModules !== 'string' || !pathToModules.length)
        throw new ModuleManagerError()
            .setMessage('Не удалось задать путь к директории модулей. Путь не передан или представлен в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_PATH_TO_MODULES);
    if (!$swiftUtils.fs.existsSync(pathToModules) || !$fs.statSync(pathToModules).isDirectory())
        throw new ModuleManagerError()
            .setMessage('Не удалось задать путь к директории модулей. Директория (' + pathToModules + ') не найдена')
            .setCode(ModuleManagerError.codes.MODULES_DIRECTORY_NOT_FOUND);

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
    if (typeof requestListener !== 'function')
        throw new ModuleManagerError()
            .setMessage('Не удалось задать слушателя запросов. Слушатель запросов не передан или представлен в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_REQUEST_LISTENER);
    if (typeof requestListener.get !== 'function' || typeof requestListener.post !== 'function' ||
        typeof requestListener.put !== 'function' || typeof requestListener.delete !== 'function')
        throw new ModuleManagerError()
            .setMessage('Не удалось задать слушателя запросов. Неизвестный слушатель запросов')
            .setCode(ModuleManagerError.codes.UNKNOWN_REQUEST_LISTENER);

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
    if (this._isRun)
        throw new ModuleManagerError()
            .setMessage('Не удалось задать маршруты. Модули уже запущены')
            .setCode(ModuleManagerError.codes.MODULES_ALREADY_RUN);
    if (!$swiftUtils.type.isObject(routes))
        throw new ModuleManagerError()
            .setMessage('Не удалось задать маршруты. Мрашруты не переданы или представлены в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_ROUTES);

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
    if (this._isRun)
        throw new ModuleManagerError()
            .setMessage('Не удалось добавить маршрут. Модули уже запущены')
            .setCode(ModuleManagerError.codes.MODULES_ALREADY_RUN);
    if (typeof moduleName !== 'string' || !moduleName.length)
        throw new ModuleManagerError()
            .setMessage('Не удалось добавить маршрут. Имя модуля не передано или представлено в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_MODULE_NAME);
    if (typeof controllerName !== 'string' || !controllerName.length)
        throw new ModuleManagerError()
            .setMessage('Не удалось добавить маршрут. Имя контроллера не передано или представлено в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_CONTROLLER_NAME);
    if (typeof actionName !== 'string' || !actionName.length)
        throw new ModuleManagerError()
            .setMessage('Не удалось добавить маршрут. Имя экшена не передано или представлено в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_ACTION_NAME);
    if (typeof path !== 'string' || !path.length)
        throw new ModuleManagerError()
            .setMessage('Не удалось добавить маршрут. Путь не передан или представлен в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_PATH);

    this._routes[moduleName] = this._routes[moduleName] || {};
    this._routes[moduleName][controllerName] = this._routes[moduleName][controllerName] || {};
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
    if (this._isRun)
        throw new ModuleManagerError()
            .setMessage('Не удалось добавить модуль. Модули уже запущены')
            .setCode(ModuleManagerError.codes.MODULES_ALREADY_RUN);
    if (!(modul instanceof Module))
        throw new ModuleManagerError()
            .setMessage('Не удалось добавить модуль. Модуль не передан или представлен в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_MODULE);

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
    if (this._isRun)
        throw new ModuleManagerError()
            .setMessage('Не удалось загрузить модуль. Модули уже запущены')
            .setCode(ModuleManagerError.codes.MODULES_ALREADY_RUN);
    if (typeof moduleName !== 'string' || !moduleName.length)
        throw new ModuleManagerError()
            .setMessage('Не удалось загрузить модуль. Имя модуля не передано или представлено в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_MODULE_NAME);

    var pathToModule = this._pathToModules + '/' + moduleName.split('.').join('/modules/'),
        modul;

    if (!$swiftUtils.fs.existsSync(pathToModule) || !$fs.statSync(pathToModule).isDirectory())
        throw new ModuleManagerError()
            .setMessage('Не удалось загрузить модуль. Директория модуля (' + pathToModule + ') не найдена')
            .setCode(ModuleManagerError.codes.MODULE_DIRECTORY_NOT_FOUND);


    //
    // задание параметров модуля
    //

    modul = new Module()
        .setName(moduleName)
        .setPathToModule(pathToModule)
        .setRequestListener(this._requestListener)
        .setRoutes(this._routes[moduleName] || {})
    ;

    //
    // добавление модуля
    //

    this.addModule(modul);

    //
    ////
    //

    return this;
};

/**
 * Получение модуля
 *
 * @param {String|undefined} moduleName название модуля
 *
 * @return {ModuleManager}
 */
ModuleManager.prototype.getModule = function getModule (moduleName)
{
    if (typeof moduleName !== 'string' || !moduleName.length)
        throw new ModuleManagerError()
            .setMessage('Не удалось получить модуль. Имя модуля не передано или представлено в недопустимом формате')
            .setCode(ModuleManagerError.codes.BAD_MODULE_NAME);

    return this._modules[moduleName];
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
        cb(new ModuleManagerError()
            .setMessage('Не удалось загрузить модуль. Модули уже запущены')
            .setCode(ModuleManagerError.codes.MODULES_ALREADY_RUN));
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
            errors.push(new ModuleManagerError()
                .setMessage('модуль "' + moduleName + '" не найден')
                .setCode(ModuleManagerError.codes.MODULE_NOT_FOUND));
            loading--;
            continue;
        }

        (function (moduleName)
        {
            modul.run(function (err)
            {
                if (err) errors.push(new ModuleManagerError()
                    .setMessage('во время загрузки модуля "' + moduleName + '" возникли ошибки (модуль вернул: ' + err.message + ')')
                    .setDetails(err)
                    .setCode(ModuleManagerError.codes.RUN_MODULE_ERROR));
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
                cb(errors);
                return;
            }

            cb(null);
        });
    })();

    //
    ////
    //

    return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.ModuleManager = ModuleManager;