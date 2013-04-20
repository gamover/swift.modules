/**
 * Created by G@mOBEP
 *
 * Company: Realweb
 * Date: 28.01.13
 * Time: 10:49
 *
 * Модуль Swift.
 */

var $path = require('path'),

    $swiftUtils = require('swift.utils'),

    immediate = typeof setImmediate === 'function' ? setImmediate : process.nextTick,

    packageUtil = $swiftUtils.package,
    typeUtil = $swiftUtils.type,
    fsUtil = $swiftUtils.fs,

    countModules = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Получение кол-ва созданных модулей
 *
 * @returns {Number}
 */
exports.getCountModules = function getCountModules ()
{
    return countModules;
};

exports.Module = Module;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Module ()
{
    countModules++;

    /**
     * Флаг запущенного модуля
     *
     * @type {Boolean}
     * @private
     */
    this._isRun = false;

    /**
     * Имя модуля
     *
     * @type {String}
     * @private
     */
    this._moduleName = 'swiftModule' + countModules;

    /**
     * Путь к директории модуля
     *
     * @type {String}
     * @private
     */
    this._pathToModule = null;

    /**
     * Путь к директории моделей
     *
     * @type {String}
     * @private
     */
    this._pathToModels = null;

    /**
     * Путь к директории видов
     *
     * @type {String}
     * @private
     */
    this._pathToViews = null;

    /**
     * Путь к директории видов
     *
     * @type {String}
     * @private
     */
    this._pathToControllers = null;

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
     *         'controllerName1': {
     *             'actionName1': 'path1',
     *             'actionName2': 'path2',
     *              ...
     *             'actionNameN': 'pathN'
     *         },
     *         ...
     *         'controllerNameN': {
     *             ...
     *         }
     *     }
     * )
     *
     * @type {Object}
     * @private
     */
    this._routes = {};
}

/**
 * Задание имени модуля
 *
 * @param {String} name
 *
 * @returns {Module}
 */
Module.prototype.setName = function setName (name)
{
    if (this._isRun) return this;

    this._moduleName = name;

    return this;
};

/**
 * Получение имени модуля
 *
 * @returns {String}
 */
Module.prototype.getName = function getName ()
{
    return this._moduleName;
};

/**
 * Задание пути к директории модуля
 *
 * @param {String} pathToModule
 *
 * @returns {Module}
 */
Module.prototype.setPathToModule = function setPathToModule (pathToModule)
{
    if (this._isRun) return this;

    this._pathToModule      = $path.normalize(pathToModule);
    this._pathToModels      = this._pathToModels || this._pathToModule + '/model';
    this._pathToViews       = this._pathToViews || this._pathToModule + '/view';
    this._pathToControllers = this._pathToControllers || this._pathToModule + '/controller';

    return this;
};

/**
 * Получение пути к директории модуля
 *
 * @return {String}
 */
Module.prototype.getPathToModule = function getPathToModule ()
{
    return this._pathToModule;
};

/**
 * Задание пути к директории моделей
 *
 * @param {String} pathToModels
 *
 * @returns {Module}
 */
Module.prototype.setPathToModels = function setPathToModels (pathToModels)
{
    if (this._isRun) return this;

    this._pathToModels = $path.normalize(pathToModels);

    return this;
};

/**
 * Получение пути к директории моделей
 *
 * @return {String}
 */
Module.prototype.getPathToModels = function getPathToModels ()
{
    return this._pathToModels;
};

/**
 * Задание пути к директории видов
 *
 * @param {String} pathToViews
 *
 * @returns {Module}
 */
Module.prototype.setPathToViews = function setPathToViews (pathToViews)
{
    if (this._isRun) return this;

    this._pathToViews = $path.normalize(pathToViews);

    return this;
};

/**
 * Получение пути к директории видов
 *
 * @return {String}
 */
Module.prototype.getPathToViews = function getPathToViews ()
{
    return this._pathToViews;
};

/**
 * Задание пути к директории контроллеров
 *
 * @param {String} pathToControllers
 *
 * @returns {Module}
 */
Module.prototype.setPathToControllers = function setPathToControllers (pathToControllers)
{
    if (this._isRun) return this;

    this._pathToControllers = $path.normalize(pathToControllers);

    return this;
};

/**
 * Получение пути к директории контроллеров
 *
 * @return {String}
 */
Module.prototype.getPathToControllers = function getPathToControllers ()
{
    return this._pathToControllers;
};

/**
 * Задание слушателя запросов
 *
 * @param {Object} requestListener слушатель запросов
 *
 * @returns {Module}
 */
Module.prototype.setRequestListener = function setRequestListener (requestListener)
{
    this._requestListener = requestListener;

    return this;
};

/**
 * Получение слушателя запросов
 *
 * @returns {Object}
 */
Module.prototype.getRequestListener = function getRequestListener ()
{
    return this._requestListener;
};

/**
 * Задание маршруштов
 *
 * @param {Object} routes
 *
 * @returns {Module}
 */
Module.prototype.setRoutes = function setRoutes (routes)
{
    if (this._isRun) return this;

    this._routes = routes;

    return this;
};

/**
 * Добавление маршрута
 *
 * @param {String} controllerName название контроллера
 * @param {String} actionName название экшена
 * @param {String|RegExp} path маршрут
 *
 * @returns {Module}
 */
Module.prototype.addRoute = function addRoute (controllerName, actionName, path)
{
    if (this._isRun) return this;
    if (!controllerName || !actionName || !path) return this;

    this._routes[controllerName] = this._routes[controllerName] || {};
    this._routes[controllerName][actionName] = this._routes[controllerName][actionName] || path;

    return this;
};

/**
 * Получение маршрутов
 *
 * @returns {Object}
 */
Module.prototype.getRoutes = function getRoutes ()
{
    return this._routes;
};

/**
 * Запуск модуля (async)
 *
 * @param {Function} cb
 *
 * @returns {Module}
 */
Module.prototype.run = function run (cb)
{
    var self = this,
        loading = 0,
        errors = [],
        resRender;

    cb = cb || function () {};

    if (self._isRun)
    {
        cb(['модуль уже запущен']);
        return self;
    }

    self._isRun = true;

    for (var controllerName in self._routes)
    {
        if (!self._routes.hasOwnProperty(controllerName)) continue;

        loading++;

        (function (controllerName, routes)
        {
            var pathToController = self._pathToControllers + '/' + controllerName + '.js';

            fsUtil.exists(pathToController, function (exists)
            {
                if (!exists)
                {
                    loading--;
                    errors = errors.concat(['контроллер "' + controllerName + '" не найден']);
                    return;
                }

                var controller = require(pathToController),
                    controllerRoutes = routes[controllerName];

                for (var actionName in controllerRoutes)
                {
                    if (!controllerRoutes.hasOwnProperty(actionName)) continue;

                    (function(actionName, controllerRoutes)
                    {
                        var action = controller[actionName + 'Action'],
                            path = controllerRoutes[actionName];

                        if (typeof action !== 'function')
                        {
                            errors = errors.concat(['в контроллере "' + controllerName + '" не определен экшен "' + actionName + '"']);
                            return;
                        }

                        /**
                         * Переопределение метода Express res.render
                         *
                         * @param {Function} middle функция-прослойка
                         * @param {Object} req объект запроса
                         * @param {Object} res объект ответа
                         * @param {Function} next функция перехода к следующей прослойке
                         */
                        function middleWrapper (middle, req, res, next)
                        {
                            if (typeof middle !== 'function')
                            {
                                console.log('В экшене "' + actionName + '" контроллера "' + controllerName + '" размещена некорректная прослойка');

                                return;
                            }

                            if (typeof resRender === 'undefined') resRender = res.render;

                            /**
                             * Отрисовка шаблона
                             *
                             * @param {String|Object} viewName название шаблона
                             * @param {Object|Boolean} params параметры для передачи в шаблон
                             * @param {Boolean} def ключ указывающий использовать базовый путь к шаблону
                             *
                             * @returns {*}
                             */
                            res.render = function (viewName, params, def)
                            {
                                if (typeof params === 'boolean')
                                {
                                    def = params;
                                    params = {};
                                }
                                if (typeof viewName === 'object')
                                {
                                    params = viewName;
                                    viewName = actionName;
                                }

                                if (typeof viewName !== 'string') viewName = actionName;
                                if (!typeUtil.isObject(params)) params = {};
                                if (typeof def !== 'boolean') def = false;

                                var pathToView = !def ? self._pathToViews + '/' + viewName : viewName;

                                return resRender.call(res, pathToView, params);
                            };

                            middle.call(middle, req, res, next);
                        }

                        /**
                         * Прослойка определения текущего модуля, контроллера и экшена
                         *
                         * @param {Object} req
                         * @param {Object} res
                         * @param {Function} next
                         */
                        function defineCurrent (req, res, next)
                        {
                            if (!typeUtil.isObject(res.locals.swift)) res.locals.swift = {};

                            res.locals.swift.current = {
                                module:     self._moduleName,
                                controller: controllerName,
                                action:     actionName
                            };

                            next();
                        }

                        /**
                         * Обработчик post-запроса
                         *
                         * @returns {*}
                         */
                        action.post = function ()
                        {
                            var args_ = Array.prototype.slice.call(arguments),
                                args = [path];

                            args.push(defineCurrent);

                            args_.forEach(function (middle)
                            {
                                args.push(function (req, res, next) { middleWrapper (middle, req, res, next); });
                            });

                            return self._requestListener.post.apply(self._requestListener, args);
                        };

                        /**
                         * Обработчик get-запроса
                         *
                         * @returns {*}
                         */
                        action.get = function ()
                        {
                            var args_ = Array.prototype.slice.call(arguments),
                                args = [path];

                            args.push(defineCurrent);

                            args_.forEach(function (middle)
                            {
                                args.push(function (req, res, next) { middleWrapper (middle, req, res, next); });
                            });

                            return self._requestListener.get.apply(self._requestListener, args);
                        };

                        /**
                         * Обработчик put-запроса
                         *
                         * @returns {*}
                         */
                        action.put = function ()
                        {
                            var args_ = Array.prototype.slice.call(arguments),
                                args = [path];

                            args.push(defineCurrent);

                            args_.forEach(function (middle)
                            {
                                args.push(function (req, res, next) { middleWrapper (middle, req, res, next); });
                            });

                            return self._requestListener.put.apply(self._requestListener, args);
                        };

                        /**
                         * Обработчик delete-запроса
                         *
                         * @returns {*}
                         */
                        action.delete = function ()
                        {
                            var args_ = Array.prototype.slice.call(arguments),
                                args = [path];

                            args.push(defineCurrent);

                            args_.forEach(function (middle)
                            {
                                args.push(function (req, res, next) { middleWrapper (middle, req, res, next); });
                            });

                            return self._requestListener.delete.apply(self._requestListener, args);
                        };

                        action.call(action, self);
                    })(actionName, controllerRoutes);
                }

                loading--;
            });
        })(controllerName, self._routes);
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

            cb(errors.length ? errors : null);
        });
    })();

    return self;
};

/**
 * Подключение ресурса из директории модуля
 *
 * @param {String} path путь к ресурсу
 * @param {Object|Function} params параметры
 * @param {Function} cb
 *
 * @return {Module|Object}
 */
Module.prototype.require = function require (path, params, cb)
{
    if (typeof params === 'function') cb = params;

    //
    // парсинг токенов
    //

    if (path.indexOf(':model') === 0) path = path.replace(':model', this._pathToModels);
    else path = this._pathToModule + '/' + path;

    //
    // подключение ресурса
    //

    if (typeof cb === 'function')
    {
        packageUtil.require(path, params, cb);
        return this;
    }
    else
    {
        return packageUtil.requireSync(path, params);
    }
};

/**
 * Подключение модели
 *
 * @param {String} path путь к ресурсу
 * @param {Object} params параметры
 * @param {Function} cb
 *
 * @returns {Module|Object}
 */
Module.prototype.requireModel = function requireModel (path, params, cb)
{
    return this.require(':model/' + path, params, cb);
};