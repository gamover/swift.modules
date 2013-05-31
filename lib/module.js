/**
 * Created by G@mOBEP
 *
 * Company: Realweb
 * Date: 28.01.13
 * Time: 10:49
 *
 * Модуль Swift.
 */

var $fs = require('fs'),
    $path = require('path'),

    $swiftErrors = require('swift.errors'),
    $swiftUtils = require('swift.utils'),

    immediate = typeof setImmediate === 'function' ? setImmediate : process.nextTick,
    countModules = 0;

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
     * @type {String|null}
     * @private
     */
    this._pathToModule = null;

    /**
     * Путь к директории моделей
     *
     * @type {String|null}
     * @private
     */
    this._pathToModels = null;

    /**
     * Путь к директории видов
     *
     * @type {String|null}
     * @private
     */
    this._pathToViews = null;

    /**
     * Путь к директории видов
     *
     * @type {String|null}
     * @private
     */
    this._pathToControllers = null;

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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('не удалось изменить имя модулю "' + this._moduleName + '". Модуль уже запущен');
    if (typeof name !== 'string')
        throw new $swiftErrors.TypeError('не удалось изменить имя модулю "' + this._moduleName + '". Недопустимый тип имени модуля (ожидается: "string", принято: "' + typeof name + '")');
    if (!name.length)
        throw new $swiftErrors.ValueError('не удалось изменить имя модулю "' + this._moduleName + '". Пустое значение имени модуля');
    //
    // задание имени модуля
    //
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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('не удалось задать путь к директории модуля "' + this._moduleName + '". Модуль уже запущен');
    if (typeof pathToModule !== 'string')
        throw new $swiftErrors.TypeError('не удалось задать путь к директории модуля "' + this._moduleName + '". Недопустимый тип пути к директории модуля (ожидается: "string", принято: "' + typeof pathToModule + '")');
    if (!pathToModule.length)
        throw new $swiftErrors.ValueError('не удалось задать путь к директории модуля "' + this._moduleName + '". Пустое значение пути к к директории модуля');
    if (!$swiftUtils.fs.existsSync(pathToModule) || !$fs.statSync(pathToModule).isDirectory())
        throw new $swiftErrors.SystemError('не удалось задать путь к директории модуля "' + this._moduleName + '". Директория "' + pathToModule + '" не найдена');
    //
    // задание путей
    //
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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('не удалось задать путь к директории моделей модуля "' + this._moduleName + '". Модуль уже запущен');
    if (typeof pathToModels !== 'string')
        throw new $swiftErrors.TypeError('не удалось задать путь к директории моделей модуля "' + this._moduleName + '". Недопустимый тип пути к директории моделей (ожидается: "string", принято: "' + typeof pathToModels + '")');
    if (!pathToModels.length)
        throw new $swiftErrors.ValueError('не удалось задать путь к директории моделей модуля "' + this._moduleName + '". Пустое значение пути к к директории моделей');
    if (!$swiftUtils.fs.existsSync(pathToModels) || !$fs.statSync(pathToModels).isDirectory())
        throw new $swiftErrors.SystemError('не удалось задать путь к директории моделей модуля "' + this._moduleName + '". Директория "' + pathToModels + '" не найдена');
    //
    // задание пути к директории моделей
    //
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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('не удалось задать путь к директории видов модуля "' + this._moduleName + '". Модуль уже запущен');
    if (typeof pathToViews !== 'string')
        throw new $swiftErrors.TypeError('не удалось задать путь к директории видов модуля "' + this._moduleName + '". Недопустимый тип пути к директории видов (ожидается: "string", принято: "' + typeof pathToViews + '")');
    if (!pathToViews.length)
        throw new $swiftErrors.ValueError('не удалось задать путь к директории видов модуля "' + this._moduleName + '". Пустое значение пути к к директории видов');
    if (!$swiftUtils.fs.existsSync(pathToViews) || !$fs.statSync(pathToViews).isDirectory())
        throw new $swiftErrors.SystemError('не удалось задать путь к директории видов модуля "' + this._moduleName + '". Директория "' + pathToViews + '" не найдена');
    //
    // задание пути к директории видов
    //
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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('не удалось задать путь к директории контроллеров модуля "' + this._moduleName + '". Модуль уже запущен');
    if (typeof pathToControllers !== 'string')
        throw new $swiftErrors.TypeError('не удалось задать путь к директории контроллеров модуля "' + this._moduleName + '". Недопустимый тип пути к директории контроллеров (ожидается: "string", принято: "' + typeof pathToControllers + '")');
    if (!pathToControllers.length)
        throw new $swiftErrors.ValueError('не удалось задать путь к директории контроллеров модуля "' + this._moduleName + '". Пустое значение пути к к директории контроллеров');
    if (!$swiftUtils.fs.existsSync(pathToControllers) || !$fs.statSync(pathToControllers).isDirectory())
        throw new $swiftErrors.SystemError('не удалось задать путь к директории контроллеров модуля "' + this._moduleName + '". Директория "' + pathToControllers + '" не найдена');
    //
    // задание пути к директории контроллеров
    //
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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('не удалось задать слушателя запросов в модуле "' + this._moduleName + '". Модуль уже запущен');
    if (typeof requestListener !== 'function')
        throw new $swiftErrors.TypeError('не удалось задать слушателя запросов в модуле "' + this._moduleName + '". Недопустимый тип слушателя запросов (ожидается: "function", принято: "' + typeof requestListener + '")');
    if (typeof requestListener.get !== 'function' || typeof requestListener.post !== 'function' ||
        typeof requestListener.put !== 'function' || typeof requestListener.delete !== 'function')
        throw new $swiftErrors.ValueError('не удалось задать слушателя запросов в модуле "' + this._moduleName + '". Неизвестный слушатель запросов');
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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('не удалось задать маршруты в модуле "' + this._moduleName + '". Модуль уже запущен');
    if (!$swiftUtils.type.isObject(routes))
        throw new $swiftErrors.TypeError('не удалось задать маршруты в модуле "' + this._moduleName + '". Недопустимый тип маршрутов (ожидается: "object", принято: "' + typeof routes + '")');
    //
    // задание маршрутов
    //
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
    //
    // проверка параметров
    //
    if (this._isRun)
        throw new $swiftErrors.SystemError('не удалось добавить маршрут в модуле "' + this._moduleName + '". Модуль уже запущен');
    if (typeof controllerName !== 'string')
        throw new $swiftErrors.TypeError('не удалось добавить маршрут в модуле "' + this._moduleName + '". Недопустимый тип имени контроллера (ожидается: "string", принято: "' + typeof controllerName + '")');
    if (!controllerName.length)
        throw new $swiftErrors.ValueError('не удалось добавить маршрут в модуле "' + this._moduleName + '". Пустое значение имени контроллера');
    if (typeof actionName !== 'string')
        throw new $swiftErrors.TypeError('не удалось добавить маршрут в модуле "' + this._moduleName + '". Недопустимый тип имени экшена (ожидается: "string", принято: "' + typeof actionName + '")');
    if (!actionName.length)
        throw new $swiftErrors.ValueError('не удалось добавить маршрут в модуле "' + this._moduleName + '". Пустое значение имени экшена');
    if (typeof path !== 'string')
        throw new $swiftErrors.TypeError('не удалось добавить маршрут в модуле "' + this._moduleName + '". Недопустимый тип пути (ожидается: "string", принято: "' + typeof path + '")');
    if (!path.length)
        throw new $swiftErrors.ValueError('не удалось добавить маршрут в модуле "' + this._moduleName + '". Пустое значение пути');
    //
    // добавление маршрута
    //
    this._routes[controllerName]             = this._routes[controllerName] || {};
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
    cb = cb || function () {};

    if (this._isRun)
    {
        cb(new $swiftErrors.SystemError('не удалось запустить модуль "' + this._moduleName + '". Модуль уже запущен'));
        return this;
    }

    var self = this,
        loading = 0,
        error = null,
        resRender;

    this._isRun = true;

    for (var controllerName in this._routes)
    {
        if (!this._routes.hasOwnProperty(controllerName)) continue;

        loading++;

        (function (controllerName, routes)
        {
            var pathToController = self._pathToControllers + '/' + controllerName + '.js';

            $swiftUtils.fs.exists(pathToController, function (exists)
            {
                if (!exists)
                {
                    if (!error) error = new $swiftErrors.SystemError('не удалось запустить модуль "' + self._moduleName + '". Контроллер "' + controllerName + '" не найден');
                    loading--;
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
                            if (!error) error = new $swiftErrors.SystemError('не удалось запустить модуль "' + self._moduleName + '". В контроллере "' + controllerName + '" не определен экшен "' + actionName + '"');
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
                                console.log('В экшене "' + actionName + '" контроллера "' + controllerName + '" модуля "' + self._moduleName + '" размещена некорректная прослойка');

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
                                if (!$swiftUtils.type.isObject(params)) params = {};
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
                            if (!$swiftUtils.type.isObject(res.locals.swift)) res.locals.swift = {};

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
        })(controllerName, this._routes);
    }
    //
    // ожидание окончания запуска модулей
    //
    (function awaiting ()
    {
        immediate(function ()
        {
            if (error)
            {
                cb(error);
                return;
            }

            if (loading)
            {
                awaiting();
                return;
            }

            cb(null);
        });
    })();

    return this;
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
    var error;

    if (typeof params === 'function')
    {
        cb = params;
        params = {};
    }
    //
    // проверка параметров
    //
    if (typeof path !== 'string')
        error = new $swiftErrors.TypeError('не удалось подключить ресурс из директории модуля "' + this._moduleName + '". Недопустимый тип пути к ресурсу (ожидается: "string", принято: "' + typeof path + '")');
    if (!path.length)
        error = new $swiftErrors.ValueError('не удалось подключить ресурс из директории модуля "' + this._moduleName + '". Пустое значение пути к ресурсу');

    if (error)
    {
        if (typeof cb === 'function')
        {
            cb(error);
            return this;
        }
        else throw error;
    }
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
        $swiftUtils.package.require(path, params, cb);
        return this;
    }
    else return $swiftUtils.package.requireSync(path, params);
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.Module = Module;