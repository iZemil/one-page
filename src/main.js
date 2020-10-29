/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function s(window, document, exportName, undefined) {
    const VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
    const TEST_ELEMENT = document.createElement('div');

    const TYPE_FUNCTION = 'function';

    const round = Math.round;
    const abs = Math.abs;
    const now = Date.now;

    /**
     * set a timeout with a given scope
     * @param {Function} fn
     * @param {Number} timeout
     * @param {Object} context
     * @returns {number}
     */
    function setTimeoutContext(fn, timeout, context) {
        return setTimeout(bindFn(fn, context), timeout);
    }

    /**
     * if the argument is an array, we want to execute the fn on each entry
     * if it aint an array we don't want to do a thing.
     * this is used by all the methods that accept a single and array argument.
     * @param {*|Array} arg
     * @param {String} fn
     * @param {Object} [context]
     * @returns {Boolean}
     */
    function invokeArrayArg(arg, fn, context) {
        if (Array.isArray(arg)) {
            each(arg, context[fn], context);
            return true;
        }
        return false;
    }

    /**
     * walk objects and arrays
     * @param {Object} obj
     * @param {Function} iterator
     * @param {Object} context
     */
    function each(obj, iterator, context) {
        let i;

        if (!obj) {
            return;
        }

        if (obj.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length !== undefined) {
            i = 0;
            while (i < obj.length) {
                iterator.call(context, obj[i], i, obj);
                i++;
            }
        } else {
            for (i in obj) {
                obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
        }
    }

    /**
     * wrap a method with a deprecation warning and stack trace
     * @param {Function} method
     * @param {String} name
     * @param {String} message
     * @returns {Function} A new function wrapping the supplied method.
     */
    function deprecate(method, name, message) {
        const deprecationMessage = `DEPRECATED METHOD: ${name}\n${message} AT \n`;
        return function() {
            const e = new Error('get-stack-trace');
            const stack =
                e && e.stack
                    ? e.stack
                          .replace(/^[^\(]+?[\n$]/gm, '')
                          .replace(/^\s+at\s+/gm, '')
                          .replace(
                              /^Object.<anonymous>\s*\(/gm,
                              '{anonymous}()@'
                          )
                    : 'Unknown Stack Trace';

            const log =
                window.console && (window.console.warn || window.console.log);
            if (log) {
                log.call(window.console, deprecationMessage, stack);
            }
            return method.apply(this, arguments);
        };
    }

    /**
     * extend object.
     * means that properties in dest will be overwritten by the ones in src.
     * @param {Object} target
     * @param {...Object} objects_to_assign
     * @returns {Object} target
     */
    let assign;
    if (typeof Object.assign !== 'function') {
        assign = function assign(target) {
            if (target === undefined || target === null) {
                throw new TypeError(
                    'Cannot convert undefined or null to object'
                );
            }

            const output = Object(target);
            for (let index = 1; index < arguments.length; index++) {
                const source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (const nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    } else {
        assign = Object.assign;
    }

    /**
     * extend object.
     * means that properties in dest will be overwritten by the ones in src.
     * @param {Object} dest
     * @param {Object} src
     * @param {Boolean} [merge=false]
     * @returns {Object} dest
     */
    const extend = deprecate(
        (dest, src, merge) => {
            const keys = Object.keys(src);
            let i = 0;
            while (i < keys.length) {
                if (!merge || (merge && dest[keys[i]] === undefined)) {
                    dest[keys[i]] = src[keys[i]];
                }
                i++;
            }
            return dest;
        },
        'extend',
        'Use `assign`.'
    );

    /**
     * merge the values from src in the dest.
     * means that properties that exist in dest will not be overwritten by src
     * @param {Object} dest
     * @param {Object} src
     * @returns {Object} dest
     */
    const merge = deprecate(
        (dest, src) => extend(dest, src, true),
        'merge',
        'Use `assign`.'
    );

    /**
     * simple class inheritance
     * @param {Function} child
     * @param {Function} base
     * @param {Object} [properties]
     */
    function inherit(child, base, properties) {
        const baseP = base.prototype;
        let childP;

        childP = child.prototype = Object.create(baseP);
        childP.constructor = child;
        childP._super = baseP;

        if (properties) {
            assign(childP, properties);
        }
    }

    /**
     * simple function bind
     * @param {Function} fn
     * @param {Object} context
     * @returns {Function}
     */
    function bindFn(fn, context) {
        return function boundFn() {
            return fn.apply(context, arguments);
        };
    }

    /**
     * let a boolean value also be a function that must return a boolean
     * this first item in args will be used as the context
     * @param {Boolean|Function} val
     * @param {Array} [args]
     * @returns {Boolean}
     */
    function boolOrFn(val, args) {
        if (typeof val === TYPE_FUNCTION) {
            return val.apply(args ? args[0] || undefined : undefined, args);
        }
        return val;
    }

    /**
     * use the val2 when val1 is undefined
     * @param {*} val1
     * @param {*} val2
     * @returns {*}
     */
    function ifUndefined(val1, val2) {
        return val1 === undefined ? val2 : val1;
    }

    /**
     * addEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */
    function addEventListeners(target, types, handler) {
        each(splitStr(types), type => {
            target.addEventListener(type, handler, false);
        });
    }

    /**
     * removeEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */
    function removeEventListeners(target, types, handler) {
        each(splitStr(types), type => {
            target.removeEventListener(type, handler, false);
        });
    }

    /**
     * find if a node is in the given parent
     * @method hasParent
     * @param {HTMLElement} node
     * @param {HTMLElement} parent
     * @return {Boolean} found
     */
    function hasParent(node, parent) {
        while (node) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }

    /**
     * small indexOf wrapper
     * @param {String} str
     * @param {String} find
     * @returns {Boolean} found
     */
    function inStr(str, find) {
        return str.indexOf(find) > -1;
    }

    /**
     * split string on whitespace
     * @param {String} str
     * @returns {Array} words
     */
    function splitStr(str) {
        return str.trim().split(/\s+/g);
    }

    /**
     * find if a array contains the object using indexOf or a simple polyFill
     * @param {Array} src
     * @param {String} find
     * @param {String} [findByKey]
     * @return {Boolean|Number} false when not found, or the index
     */
    function inArray(src, find, findByKey) {
        if (src.indexOf && !findByKey) {
            return src.indexOf(find);
        }
        let i = 0;
        while (i < src.length) {
            if (
                (findByKey && src[i][findByKey] == find) ||
                (!findByKey && src[i] === find)
            ) {
                return i;
            }
            i++;
        }
        return -1;
    }

    /**
     * convert array-like objects to real arrays
     * @param {Object} obj
     * @returns {Array}
     */
    function toArray(obj) {
        return Array.prototype.slice.call(obj, 0);
    }

    /**
     * unique array with objects based on a key (like 'id') or just by the array's value
     * @param {Array} src [{id:1},{id:2},{id:1}]
     * @param {String} [key]
     * @param {Boolean} [sort=False]
     * @returns {Array} [{id:1},{id:2}]
     */
    function uniqueArray(src, key, sort) {
        let results = [];
        const values = [];
        let i = 0;

        while (i < src.length) {
            const val = key ? src[i][key] : src[i];
            if (inArray(values, val) < 0) {
                results.push(src[i]);
            }
            values[i] = val;
            i++;
        }

        if (sort) {
            if (!key) {
                results = results.sort();
            } else {
                results = results.sort((a, b) => a[key] > b[key]);
            }
        }

        return results;
    }

    /**
     * get the prefixed property
     * @param {Object} obj
     * @param {String} property
     * @returns {String|Undefined} prefixed
     */
    function prefixed(obj, property) {
        let prefix;
        let prop;
        const camelProp = property[0].toUpperCase() + property.slice(1);

        let i = 0;
        while (i < VENDOR_PREFIXES.length) {
            prefix = VENDOR_PREFIXES[i];
            prop = prefix ? prefix + camelProp : property;

            if (prop in obj) {
                return prop;
            }
            i++;
        }
        return undefined;
    }

    /**
     * get a unique id
     * @returns {number} uniqueId
     */
    let _uniqueId = 1;
    function uniqueId() {
        return _uniqueId++;
    }

    /**
     * get the window object of an element
     * @param {HTMLElement} element
     * @returns {DocumentView|Window}
     */
    function getWindowForElement(element) {
        const doc = element.ownerDocument || element;
        return doc.defaultView || doc.parentWindow || window;
    }

    const MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

    const SUPPORT_TOUCH = 'ontouchstart' in window;
    const SUPPORT_POINTER_EVENTS =
        prefixed(window, 'PointerEvent') !== undefined;
    const SUPPORT_ONLY_TOUCH =
        SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

    const INPUT_TYPE_TOUCH = 'touch';
    const INPUT_TYPE_PEN = 'pen';
    const INPUT_TYPE_MOUSE = 'mouse';
    const INPUT_TYPE_KINECT = 'kinect';

    const COMPUTE_INTERVAL = 25;

    const INPUT_START = 1;
    const INPUT_MOVE = 2;
    const INPUT_END = 4;
    const INPUT_CANCEL = 8;

    const DIRECTION_NONE = 1;
    const DIRECTION_LEFT = 2;
    const DIRECTION_RIGHT = 4;
    const DIRECTION_UP = 8;
    const DIRECTION_DOWN = 16;

    const DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    const DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    const DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

    const PROPS_XY = ['x', 'y'];
    const PROPS_CLIENT_XY = ['clientX', 'clientY'];

    /**
     * create new input type manager
     * @param {Manager} manager
     * @param {Function} callback
     * @returns {Input}
     * @constructor
     */
    function Input(manager, callback) {
        const self = this;
        this.manager = manager;
        this.callback = callback;
        this.element = manager.element;
        this.target = manager.options.inputTarget;

        // smaller wrapper around the handler, for the scope and the enabled state of the manager,
        // so when disabled the input events are completely bypassed.
        this.domHandler = function(ev) {
            if (boolOrFn(manager.options.enable, [manager])) {
                self.handler(ev);
            }
        };

        this.init();
    }

    Input.prototype = {
        /**
         * should handle the inputEvent data and trigger the callback
         * @virtual
         */
        handler() {},

        /**
         * bind the events
         */
        init() {
            this.evEl &&
                addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget &&
                addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin &&
                addEventListeners(
                    getWindowForElement(this.element),
                    this.evWin,
                    this.domHandler
                );
        },

        /**
         * unbind the events
         */
        destroy() {
            this.evEl &&
                removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget &&
                removeEventListeners(
                    this.target,
                    this.evTarget,
                    this.domHandler
                );
            this.evWin &&
                removeEventListeners(
                    getWindowForElement(this.element),
                    this.evWin,
                    this.domHandler
                );
        }
    };

    /**
     * create new input type manager
     * called by the Manager constructor
     * @param {Hammer} manager
     * @returns {Input}
     */
    function createInputInstance(manager) {
        let Type;
        const inputClass = manager.options.inputClass;

        if (inputClass) {
            Type = inputClass;
        } else if (SUPPORT_POINTER_EVENTS) {
            Type = PointerEventInput;
        } else if (SUPPORT_ONLY_TOUCH) {
            Type = TouchInput;
        } else if (!SUPPORT_TOUCH) {
            Type = MouseInput;
        } else {
            Type = TouchMouseInput;
        }
        return new Type(manager, inputHandler);
    }

    /**
     * handle input events
     * @param {Manager} manager
     * @param {String} eventType
     * @param {Object} input
     */
    function inputHandler(manager, eventType, input) {
        const pointersLen = input.pointers.length;
        const changedPointersLen = input.changedPointers.length;
        const isFirst =
            eventType & INPUT_START && pointersLen - changedPointersLen === 0;
        const isFinal =
            eventType & (INPUT_END | INPUT_CANCEL) &&
            pointersLen - changedPointersLen === 0;

        input.isFirst = !!isFirst;
        input.isFinal = !!isFinal;

        if (isFirst) {
            manager.session = {};
        }

        // source event is the normalized value of the domEvents
        // like 'touchstart, mouseup, pointerdown'
        input.eventType = eventType;

        // compute scale, rotation etc
        computeInputData(manager, input);

        // emit secret event
        manager.emit('hammer.input', input);

        manager.recognize(input);
        manager.session.prevInput = input;
    }

    /**
     * extend the data with some usable properties like scale, rotate, velocity etc
     * @param {Object} manager
     * @param {Object} input
     */
    function computeInputData(manager, input) {
        const session = manager.session;
        const pointers = input.pointers;
        const pointersLength = pointers.length;

        // store the first input to calculate the distance and direction
        if (!session.firstInput) {
            session.firstInput = simpleCloneInputData(input);
        }

        // to compute scale and rotation we need to store the multiple touches
        if (pointersLength > 1 && !session.firstMultiple) {
            session.firstMultiple = simpleCloneInputData(input);
        } else if (pointersLength === 1) {
            session.firstMultiple = false;
        }

        const firstInput = session.firstInput;
        const firstMultiple = session.firstMultiple;
        const offsetCenter = firstMultiple
            ? firstMultiple.center
            : firstInput.center;

        const center = (input.center = getCenter(pointers));
        input.timeStamp = now();
        input.deltaTime = input.timeStamp - firstInput.timeStamp;

        input.angle = getAngle(offsetCenter, center);
        input.distance = getDistance(offsetCenter, center);

        computeDeltaXY(session, input);
        input.offsetDirection = getDirection(input.deltaX, input.deltaY);

        const overallVelocity = getVelocity(
            input.deltaTime,
            input.deltaX,
            input.deltaY
        );
        input.overallVelocityX = overallVelocity.x;
        input.overallVelocityY = overallVelocity.y;
        input.overallVelocity =
            abs(overallVelocity.x) > abs(overallVelocity.y)
                ? overallVelocity.x
                : overallVelocity.y;

        input.scale = firstMultiple
            ? getScale(firstMultiple.pointers, pointers)
            : 1;
        input.rotation = firstMultiple
            ? getRotation(firstMultiple.pointers, pointers)
            : 0;

        input.maxPointers = !session.prevInput
            ? input.pointers.length
            : input.pointers.length > session.prevInput.maxPointers
                ? input.pointers.length
                : session.prevInput.maxPointers;

        computeIntervalInputData(session, input);

        // find the correct target
        let target = manager.element;
        if (hasParent(input.srcEvent.target, target)) {
            target = input.srcEvent.target;
        }
        input.target = target;
    }

    function computeDeltaXY(session, input) {
        const center = input.center;
        let offset = session.offsetDelta || {};
        let prevDelta = session.prevDelta || {};
        const prevInput = session.prevInput || {};

        if (
            input.eventType === INPUT_START ||
            prevInput.eventType === INPUT_END
        ) {
            prevDelta = session.prevDelta = {
                x: prevInput.deltaX || 0,
                y: prevInput.deltaY || 0
            };

            offset = session.offsetDelta = {
                x: center.x,
                y: center.y
            };
        }

        input.deltaX = prevDelta.x + (center.x - offset.x);
        input.deltaY = prevDelta.y + (center.y - offset.y);
    }

    /**
     * velocity is calculated every x ms
     * @param {Object} session
     * @param {Object} input
     */
    function computeIntervalInputData(session, input) {
        const last = session.lastInterval || input;
        const deltaTime = input.timeStamp - last.timeStamp;
        let velocity;

        let velocityX;

        let velocityY;
        let direction;

        if (
            input.eventType != INPUT_CANCEL &&
            (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)
        ) {
            const deltaX = input.deltaX - last.deltaX;
            const deltaY = input.deltaY - last.deltaY;

            const v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY);

            session.lastInterval = input;
        } else {
            // use latest velocity info if it doesn't overtake a minimum period
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
        }

        input.velocity = velocity;
        input.velocityX = velocityX;
        input.velocityY = velocityY;
        input.direction = direction;
    }

    /**
     * create a simple clone from the input used for storage of firstInput and firstMultiple
     * @param {Object} input
     * @returns {Object} clonedInputData
     */
    function simpleCloneInputData(input) {
        // make a simple copy of the pointers because we will get a reference if we don't
        // we only need clientXY for the calculations
        const pointers = [];
        let i = 0;
        while (i < input.pointers.length) {
            pointers[i] = {
                clientX: round(input.pointers[i].clientX),
                clientY: round(input.pointers[i].clientY)
            };
            i++;
        }

        return {
            timeStamp: now(),
            pointers,
            center: getCenter(pointers),
            deltaX: input.deltaX,
            deltaY: input.deltaY
        };
    }

    /**
     * get the center of all the pointers
     * @param {Array} pointers
     * @return {Object} center contains `x` and `y` properties
     */
    function getCenter(pointers) {
        const pointersLength = pointers.length;

        // no need to loop when only one touch
        if (pointersLength === 1) {
            return {
                x: round(pointers[0].clientX),
                y: round(pointers[0].clientY)
            };
        }

        let x = 0;
        let y = 0;
        let i = 0;
        while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
        }

        return {
            x: round(x / pointersLength),
            y: round(y / pointersLength)
        };
    }

    /**
     * calculate the velocity between two points. unit is in px per ms.
     * @param {Number} deltaTime
     * @param {Number} x
     * @param {Number} y
     * @return {Object} velocity `x` and `y`
     */
    function getVelocity(deltaTime, x, y) {
        return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
        };
    }

    /**
     * get the direction between two points
     * @param {Number} x
     * @param {Number} y
     * @return {Number} direction
     */
    function getDirection(x, y) {
        if (x === y) {
            return DIRECTION_NONE;
        }

        if (abs(x) >= abs(y)) {
            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
        return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }

    /**
     * calculate the absolute distance between two points
     * @param {Object} p1 {x, y}
     * @param {Object} p2 {x, y}
     * @param {Array} [props] containing x and y keys
     * @return {Number} distance
     */
    function getDistance(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        const x = p2[props[0]] - p1[props[0]];
        const y = p2[props[1]] - p1[props[1]];

        return Math.sqrt(x * x + y * y);
    }

    /**
     * calculate the angle between two coordinates
     * @param {Object} p1
     * @param {Object} p2
     * @param {Array} [props] containing x and y keys
     * @return {Number} angle
     */
    function getAngle(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        const x = p2[props[0]] - p1[props[0]];
        const y = p2[props[1]] - p1[props[1]];
        return (Math.atan2(y, x) * 180) / Math.PI;
    }

    /**
     * calculate the rotation degrees between two pointersets
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} rotation
     */
    function getRotation(start, end) {
        return (
            getAngle(end[1], end[0], PROPS_CLIENT_XY) +
            getAngle(start[1], start[0], PROPS_CLIENT_XY)
        );
    }

    /**
     * calculate the scale factor between two pointersets
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} scale
     */
    function getScale(start, end) {
        return (
            getDistance(end[0], end[1], PROPS_CLIENT_XY) /
            getDistance(start[0], start[1], PROPS_CLIENT_XY)
        );
    }

    const MOUSE_INPUT_MAP = {
        mousedown: INPUT_START,
        mousemove: INPUT_MOVE,
        mouseup: INPUT_END
    };

    const MOUSE_ELEMENT_EVENTS = 'mousedown';
    const MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

    /**
     * Mouse events input
     * @constructor
     * @extends Input
     */
    function MouseInput() {
        this.evEl = MOUSE_ELEMENT_EVENTS;
        this.evWin = MOUSE_WINDOW_EVENTS;

        this.pressed = false; // mousedown state

        Input.apply(this, arguments);
    }

    inherit(MouseInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function MEhandler(ev) {
            let eventType = MOUSE_INPUT_MAP[ev.type];

            // on start we want to have the left mouse button down
            if (eventType & INPUT_START && ev.button === 0) {
                this.pressed = true;
            }

            if (eventType & INPUT_MOVE && ev.which !== 1) {
                eventType = INPUT_END;
            }

            // mouse must be down
            if (!this.pressed) {
                return;
            }

            if (eventType & INPUT_END) {
                this.pressed = false;
            }

            this.callback(this.manager, eventType, {
                pointers: [ev],
                changedPointers: [ev],
                pointerType: INPUT_TYPE_MOUSE,
                srcEvent: ev
            });
        }
    });

    const POINTER_INPUT_MAP = {
        pointerdown: INPUT_START,
        pointermove: INPUT_MOVE,
        pointerup: INPUT_END,
        pointercancel: INPUT_CANCEL,
        pointerout: INPUT_CANCEL
    };

    // in IE10 the pointer types is defined as an enum
    const IE10_POINTER_TYPE_ENUM = {
        2: INPUT_TYPE_TOUCH,
        3: INPUT_TYPE_PEN,
        4: INPUT_TYPE_MOUSE,
        5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
    };

    let POINTER_ELEMENT_EVENTS = 'pointerdown';
    let POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

    // IE10 has prefixed support, and case-sensitive
    if (window.MSPointerEvent && !window.PointerEvent) {
        POINTER_ELEMENT_EVENTS = 'MSPointerDown';
        POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
    }

    /**
     * Pointer events input
     * @constructor
     * @extends Input
     */
    function PointerEventInput() {
        this.evEl = POINTER_ELEMENT_EVENTS;
        this.evWin = POINTER_WINDOW_EVENTS;

        Input.apply(this, arguments);

        this.store = this.manager.session.pointerEvents = [];
    }

    inherit(PointerEventInput, Input, {
        /**
         * handle mouse events
         * @param {Object} ev
         */
        handler: function PEhandler(ev) {
            const store = this.store;
            let removePointer = false;

            const eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
            const eventType = POINTER_INPUT_MAP[eventTypeNormalized];
            const pointerType =
                IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

            const isTouch = pointerType == INPUT_TYPE_TOUCH;

            // get index of the event in the store
            let storeIndex = inArray(store, ev.pointerId, 'pointerId');

            // start and mouse must be down
            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
                if (storeIndex < 0) {
                    store.push(ev);
                    storeIndex = store.length - 1;
                }
            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
                removePointer = true;
            }

            // it not found, so the pointer hasn't been down (so it's probably a hover)
            if (storeIndex < 0) {
                return;
            }

            // update the event in the store
            store[storeIndex] = ev;

            this.callback(this.manager, eventType, {
                pointers: store,
                changedPointers: [ev],
                pointerType,
                srcEvent: ev
            });

            if (removePointer) {
                // remove from the store
                store.splice(storeIndex, 1);
            }
        }
    });

    const SINGLE_TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };

    const SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
    const SINGLE_TOUCH_WINDOW_EVENTS =
        'touchstart touchmove touchend touchcancel';

    /**
     * Touch events input
     * @constructor
     * @extends Input
     */
    function SingleTouchInput() {
        this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
        this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
        this.started = false;

        Input.apply(this, arguments);
    }

    inherit(SingleTouchInput, Input, {
        handler: function TEhandler(ev) {
            const type = SINGLE_TOUCH_INPUT_MAP[ev.type];

            // should we handle the touch events?
            if (type === INPUT_START) {
                this.started = true;
            }

            if (!this.started) {
                return;
            }

            const touches = normalizeSingleTouches.call(this, ev, type);

            // when done, reset the started state
            if (
                type & (INPUT_END | INPUT_CANCEL) &&
                touches[0].length - touches[1].length === 0
            ) {
                this.started = false;
            }

            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });

    /**
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
     */
    function normalizeSingleTouches(ev, type) {
        let all = toArray(ev.touches);
        const changed = toArray(ev.changedTouches);

        if (type & (INPUT_END | INPUT_CANCEL)) {
            all = uniqueArray(all.concat(changed), 'identifier', true);
        }

        return [all, changed];
    }

    const TOUCH_INPUT_MAP = {
        touchstart: INPUT_START,
        touchmove: INPUT_MOVE,
        touchend: INPUT_END,
        touchcancel: INPUT_CANCEL
    };

    const TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

    /**
     * Multi-user touch events input
     * @constructor
     * @extends Input
     */
    function TouchInput() {
        this.evTarget = TOUCH_TARGET_EVENTS;
        this.targetIds = {};

        Input.apply(this, arguments);
    }

    inherit(TouchInput, Input, {
        handler: function MTEhandler(ev) {
            const type = TOUCH_INPUT_MAP[ev.type];
            const touches = getTouches.call(this, ev, type);
            if (!touches) {
                return;
            }

            this.callback(this.manager, type, {
                pointers: touches[0],
                changedPointers: touches[1],
                pointerType: INPUT_TYPE_TOUCH,
                srcEvent: ev
            });
        }
    });

    /**
     * @this {TouchInput}
     * @param {Object} ev
     * @param {Number} type flag
     * @returns {undefined|Array} [all, changed]
     */
    function getTouches(ev, type) {
        const allTouches = toArray(ev.touches);
        const targetIds = this.targetIds;

        // when there is only one touch, the process can be simplified
        if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
        }

        let i;
        let targetTouches;

        const changedTouches = toArray(ev.changedTouches);
        const changedTargetTouches = [];

        const target = this.target;

        // get target touches from touches
        targetTouches = allTouches.filter(touch =>
            hasParent(touch.target, target)
        );

        // collect touches
        if (type === INPUT_START) {
            i = 0;
            while (i < targetTouches.length) {
                targetIds[targetTouches[i].identifier] = true;
                i++;
            }
        }

        // filter changed touches to only contain touches that exist in the collected target ids
        i = 0;
        while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
                changedTargetTouches.push(changedTouches[i]);
            }

            // cleanup removed touches
            if (type & (INPUT_END | INPUT_CANCEL)) {
                delete targetIds[changedTouches[i].identifier];
            }
            i++;
        }

        if (!changedTargetTouches.length) {
            return;
        }

        return [
            // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
            uniqueArray(
                targetTouches.concat(changedTargetTouches),
                'identifier',
                true
            ),
            changedTargetTouches
        ];
    }

    /**
     * Combined touch and mouse input
     *
     * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
     * This because touch devices also emit mouse events while doing a touch.
     *
     * @constructor
     * @extends Input
     */

    const DEDUP_TIMEOUT = 2500;
    const DEDUP_DISTANCE = 25;

    function TouchMouseInput() {
        Input.apply(this, arguments);

        const handler = bindFn(this.handler, this);
        this.touch = new TouchInput(this.manager, handler);
        this.mouse = new MouseInput(this.manager, handler);

        this.primaryTouch = null;
        this.lastTouches = [];
    }

    inherit(TouchMouseInput, Input, {
        /**
         * handle mouse and touch events
         * @param {Hammer} manager
         * @param {String} inputEvent
         * @param {Object} inputData
         */
        handler: function TMEhandler(manager, inputEvent, inputData) {
            const isTouch = inputData.pointerType == INPUT_TYPE_TOUCH;
            const isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;

            if (
                isMouse &&
                inputData.sourceCapabilities &&
                inputData.sourceCapabilities.firesTouchEvents
            ) {
                return;
            }

            // when we're in a touch event, record touches to  de-dupe synthetic mouse event
            if (isTouch) {
                recordTouches.call(this, inputEvent, inputData);
            } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
                return;
            }

            this.callback(manager, inputEvent, inputData);
        },

        /**
         * remove the event listeners
         */
        destroy: function destroy() {
            this.touch.destroy();
            this.mouse.destroy();
        }
    });

    function recordTouches(eventType, eventData) {
        if (eventType & INPUT_START) {
            this.primaryTouch = eventData.changedPointers[0].identifier;
            setLastTouch.call(this, eventData);
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            setLastTouch.call(this, eventData);
        }
    }

    function setLastTouch(eventData) {
        const touch = eventData.changedPointers[0];

        if (touch.identifier === this.primaryTouch) {
            const lastTouch = { x: touch.clientX, y: touch.clientY };
            this.lastTouches.push(lastTouch);
            const lts = this.lastTouches;
            const removeLastTouch = function() {
                const i = lts.indexOf(lastTouch);
                if (i > -1) {
                    lts.splice(i, 1);
                }
            };
            setTimeout(removeLastTouch, DEDUP_TIMEOUT);
        }
    }

    function isSyntheticEvent(eventData) {
        const x = eventData.srcEvent.clientX;

        const y = eventData.srcEvent.clientY;
        for (let i = 0; i < this.lastTouches.length; i++) {
            const t = this.lastTouches[i];
            const dx = Math.abs(x - t.x);
            const dy = Math.abs(y - t.y);
            if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
                return true;
            }
        }
        return false;
    }

    const PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
    const NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

    // magical touchAction value
    const TOUCH_ACTION_COMPUTE = 'compute';
    const TOUCH_ACTION_AUTO = 'auto';
    const TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
    const TOUCH_ACTION_NONE = 'none';
    const TOUCH_ACTION_PAN_X = 'pan-x';
    const TOUCH_ACTION_PAN_Y = 'pan-y';
    const TOUCH_ACTION_MAP = getTouchActionProps();

    /**
     * Touch Action
     * sets the touchAction property or uses the js alternative
     * @param {Manager} manager
     * @param {String} value
     * @constructor
     */
    function TouchAction(manager, value) {
        this.manager = manager;
        this.set(value);
    }

    TouchAction.prototype = {
        /**
         * set the touchAction value on the element or enable the polyfill
         * @param {String} value
         */
        set(value) {
            // find out the touch-action by the event handlers
            if (value == TOUCH_ACTION_COMPUTE) {
                value = this.compute();
            }

            if (
                NATIVE_TOUCH_ACTION &&
                this.manager.element.style &&
                TOUCH_ACTION_MAP[value]
            ) {
                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }
            this.actions = value.toLowerCase().trim();
        },

        /**
         * just re-set the touchAction value
         */
        update() {
            this.set(this.manager.options.touchAction);
        },

        /**
         * compute the value for the touchAction property based on the recognizer's settings
         * @returns {String} value
         */
        compute() {
            let actions = [];
            each(this.manager.recognizers, recognizer => {
                if (boolOrFn(recognizer.options.enable, [recognizer])) {
                    actions = actions.concat(recognizer.getTouchAction());
                }
            });
            return cleanTouchActions(actions.join(' '));
        },

        /**
         * this method is called on each input cycle and provides the preventing of the browser behavior
         * @param {Object} input
         */
        preventDefaults(input) {
            const srcEvent = input.srcEvent;
            const direction = input.offsetDirection;

            // if the touch action did prevented once this session
            if (this.manager.session.prevented) {
                srcEvent.preventDefault();
                return;
            }

            const actions = this.actions;
            const hasNone =
                inStr(actions, TOUCH_ACTION_NONE) &&
                !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
            const hasPanY =
                inStr(actions, TOUCH_ACTION_PAN_Y) &&
                !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
            const hasPanX =
                inStr(actions, TOUCH_ACTION_PAN_X) &&
                !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

            if (hasNone) {
                // do not prevent defaults if this is a tap gesture

                const isTapPointer = input.pointers.length === 1;
                const isTapMovement = input.distance < 2;
                const isTapTouchTime = input.deltaTime < 250;

                if (isTapPointer && isTapMovement && isTapTouchTime) {
                    return;
                }
            }

            if (hasPanX && hasPanY) {
                // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
                return;
            }

            if (
                hasNone ||
                (hasPanY && direction & DIRECTION_HORIZONTAL) ||
                (hasPanX && direction & DIRECTION_VERTICAL)
            ) {
                return this.preventSrc(srcEvent);
            }
        },

        /**
         * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
         * @param {Object} srcEvent
         */
        preventSrc(srcEvent) {
            this.manager.session.prevented = true;
            srcEvent.preventDefault();
        }
    };

    /**
     * when the touchActions are collected they are not a valid value, so we need to clean things up. *
     * @param {String} actions
     * @returns {*}
     */
    function cleanTouchActions(actions) {
        // none
        if (inStr(actions, TOUCH_ACTION_NONE)) {
            return TOUCH_ACTION_NONE;
        }

        const hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
        const hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

        // if both pan-x and pan-y are set (different recognizers
        // for different directions, e.g. horizontal pan but vertical swipe?)
        // we need none (as otherwise with pan-x pan-y combined none of these
        // recognizers will work, since the browser would handle all panning
        if (hasPanX && hasPanY) {
            return TOUCH_ACTION_NONE;
        }

        // pan-x OR pan-y
        if (hasPanX || hasPanY) {
            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
        }

        // manipulation
        if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
            return TOUCH_ACTION_MANIPULATION;
        }

        return TOUCH_ACTION_AUTO;
    }

    function getTouchActionProps() {
        if (!NATIVE_TOUCH_ACTION) {
            return false;
        }
        const touchMap = {};
        const cssSupports = window.CSS && window.CSS.supports;
        [
            'auto',
            'manipulation',
            'pan-y',
            'pan-x',
            'pan-x pan-y',
            'none'
        ].forEach(val => {
            // If css.supports is not supported but there is native touch-action assume it supports
            // all values. This is the case for IE 10 and 11.
            touchMap[val] = cssSupports
                ? window.CSS.supports('touch-action', val)
                : true;
        });
        return touchMap;
    }

    /**
     * Recognizer flow explained; *
     * All recognizers have the initial state of POSSIBLE when a input session starts.
     * The definition of a input session is from the first input until the last input, with all it's movement in it. *
     * Example session for mouse-input: mousedown -> mousemove -> mouseup
     *
     * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
     * which determines with state it should be.
     *
     * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
     * POSSIBLE to give it another change on the next cycle.
     *
     *               Possible
     *                  |
     *            +-----+---------------+
     *            |                     |
     *      +-----+-----+               |
     *      |           |               |
     *   Failed      Cancelled          |
     *                          +-------+------+
     *                          |              |
     *                      Recognized       Began
     *                                         |
     *                                      Changed
     *                                         |
     *                                  Ended/Recognized
     */
    const STATE_POSSIBLE = 1;
    const STATE_BEGAN = 2;
    const STATE_CHANGED = 4;
    const STATE_ENDED = 8;
    const STATE_RECOGNIZED = STATE_ENDED;
    const STATE_CANCELLED = 16;
    const STATE_FAILED = 32;

    /**
     * Recognizer
     * Every recognizer needs to extend from this class.
     * @constructor
     * @param {Object} options
     */
    function Recognizer(options) {
        this.options = assign({}, this.defaults, options || {});

        this.id = uniqueId();

        this.manager = null;

        // default is enable true
        this.options.enable = ifUndefined(this.options.enable, true);

        this.state = STATE_POSSIBLE;

        this.simultaneous = {};
        this.requireFail = [];
    }

    Recognizer.prototype = {
        /**
         * @virtual
         * @type {Object}
         */
        defaults: {},

        /**
         * set options
         * @param {Object} options
         * @return {Recognizer}
         */
        set(options) {
            assign(this.options, options);

            // also update the touchAction, in case something changed about the directions/enabled state
            this.manager && this.manager.touchAction.update();
            return this;
        },

        /**
         * recognize simultaneous with an other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        recognizeWith(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
                return this;
            }

            const simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(
                otherRecognizer,
                this
            );
            if (!simultaneous[otherRecognizer.id]) {
                simultaneous[otherRecognizer.id] = otherRecognizer;
                otherRecognizer.recognizeWith(this);
            }
            return this;
        },

        /**
         * drop the simultaneous link. it doesnt remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRecognizeWith(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
                return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(
                otherRecognizer,
                this
            );
            delete this.simultaneous[otherRecognizer.id];
            return this;
        },

        /**
         * recognizer can only run when an other is failing
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        requireFailure(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
                return this;
            }

            const requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(
                otherRecognizer,
                this
            );
            if (inArray(requireFail, otherRecognizer) === -1) {
                requireFail.push(otherRecognizer);
                otherRecognizer.requireFailure(this);
            }
            return this;
        },

        /**
         * drop the requireFailure link. it does not remove the link on the other recognizer.
         * @param {Recognizer} otherRecognizer
         * @returns {Recognizer} this
         */
        dropRequireFailure(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
                return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(
                otherRecognizer,
                this
            );
            const index = inArray(this.requireFail, otherRecognizer);
            if (index > -1) {
                this.requireFail.splice(index, 1);
            }
            return this;
        },

        /**
         * has require failures boolean
         * @returns {boolean}
         */
        hasRequireFailures() {
            return this.requireFail.length > 0;
        },

        /**
         * if the recognizer can recognize simultaneous with an other recognizer
         * @param {Recognizer} otherRecognizer
         * @returns {Boolean}
         */
        canRecognizeWith(otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
        },

        /**
         * You should use `tryEmit` instead of `emit` directly to check
         * that all the needed recognizers has failed before emitting.
         * @param {Object} input
         */
        emit(input) {
            const self = this;
            const state = this.state;

            function emit(event) {
                self.manager.emit(event, input);
            }

            // 'panstart' and 'panmove'
            if (state < STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }

            emit(self.options.event); // simple 'eventName' events

            if (input.additionalEvent) {
                // additional event(panleft, panright, pinchin, pinchout...)
                emit(input.additionalEvent);
            }

            // panend and pancancel
            if (state >= STATE_ENDED) {
                emit(self.options.event + stateStr(state));
            }
        },

        /**
         * Check that all the require failure recognizers has failed,
         * if true, it emits a gesture event,
         * otherwise, setup the state to FAILED.
         * @param {Object} input
         */
        tryEmit(input) {
            if (this.canEmit()) {
                return this.emit(input);
            }
            // it's failing anyway
            this.state = STATE_FAILED;
        },

        /**
         * can we emit?
         * @returns {boolean}
         */
        canEmit() {
            let i = 0;
            while (i < this.requireFail.length) {
                if (
                    !(
                        this.requireFail[i].state &
                        (STATE_FAILED | STATE_POSSIBLE)
                    )
                ) {
                    return false;
                }
                i++;
            }
            return true;
        },

        /**
         * update the recognizer
         * @param {Object} inputData
         */
        recognize(inputData) {
            // make a new copy of the inputData
            // so we can change the inputData without messing up the other recognizers
            const inputDataClone = assign({}, inputData);

            // is is enabled and allow recognizing?
            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
                this.reset();
                this.state = STATE_FAILED;
                return;
            }

            // reset when we've reached the end
            if (
                this.state &
                (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)
            ) {
                this.state = STATE_POSSIBLE;
            }

            this.state = this.process(inputDataClone);

            // the recognizer has recognized a gesture
            // so trigger an event
            if (
                this.state &
                (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)
            ) {
                this.tryEmit(inputDataClone);
            }
        },

        /**
         * return the state of the recognizer
         * the actual recognizing happens in this method
         * @virtual
         * @param {Object} inputData
         * @returns {Const} STATE
         */
        process(inputData) {}, // jshint ignore:line

        /**
         * return the preferred touch-action
         * @virtual
         * @returns {Array}
         */
        getTouchAction() {},

        /**
         * called when the gesture isn't allowed to recognize
         * like when another is being recognized or it is disabled
         * @virtual
         */
        reset() {}
    };

    /**
     * get a usable string, used as event postfix
     * @param {Const} state
     * @returns {String} state
     */
    function stateStr(state) {
        if (state & STATE_CANCELLED) {
            return 'cancel';
        }
        if (state & STATE_ENDED) {
            return 'end';
        }
        if (state & STATE_CHANGED) {
            return 'move';
        }
        if (state & STATE_BEGAN) {
            return 'start';
        }
        return '';
    }

    /**
     * direction cons to string
     * @param {Const} direction
     * @returns {String}
     */
    function directionStr(direction) {
        if (direction == DIRECTION_DOWN) {
            return 'down';
        }
        if (direction == DIRECTION_UP) {
            return 'up';
        }
        if (direction == DIRECTION_LEFT) {
            return 'left';
        }
        if (direction == DIRECTION_RIGHT) {
            return 'right';
        }
        return '';
    }

    /**
     * get a recognizer by name if it is bound to a manager
     * @param {Recognizer|String} otherRecognizer
     * @param {Recognizer} recognizer
     * @returns {Recognizer}
     */
    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
        const manager = recognizer.manager;
        if (manager) {
            return manager.get(otherRecognizer);
        }
        return otherRecognizer;
    }

    /**
     * This recognizer is just used as a base for the simple attribute recognizers.
     * @constructor
     * @extends Recognizer
     */
    function AttrRecognizer() {
        Recognizer.apply(this, arguments);
    }

    inherit(AttrRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof AttrRecognizer
         */
        defaults: {
            /**
             * @type {Number}
             * @default 1
             */
            pointers: 1
        },

        /**
         * Used to check if it the recognizer receives valid input, like input.distance > 10.
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {Boolean} recognized
         */
        attrTest(input) {
            const optionPointers = this.options.pointers;
            return (
                optionPointers === 0 || input.pointers.length === optionPointers
            );
        },

        /**
         * Process the input and return the state for the recognizer
         * @memberof AttrRecognizer
         * @param {Object} input
         * @returns {*} State
         */
        process(input) {
            const state = this.state;
            const eventType = input.eventType;

            const isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
            const isValid = this.attrTest(input);

            // on cancel input and we've recognized before, return STATE_CANCELLED
            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
                return state | STATE_CANCELLED;
            }
            if (isRecognized || isValid) {
                if (eventType & INPUT_END) {
                    return state | STATE_ENDED;
                }
                if (!(state & STATE_BEGAN)) {
                    return STATE_BEGAN;
                }
                return state | STATE_CHANGED;
            }
            return STATE_FAILED;
        }
    });

    /**
     * Pan
     * Recognized when the pointer is down and moved in the allowed direction.
     * @constructor
     * @extends AttrRecognizer
     */
    function PanRecognizer() {
        AttrRecognizer.apply(this, arguments);

        this.pX = null;
        this.pY = null;
    }

    inherit(PanRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PanRecognizer
         */
        defaults: {
            event: 'pan',
            threshold: 10,
            pointers: 1,
            direction: DIRECTION_ALL
        },

        getTouchAction() {
            const direction = this.options.direction;
            const actions = [];
            if (direction & DIRECTION_HORIZONTAL) {
                actions.push(TOUCH_ACTION_PAN_Y);
            }
            if (direction & DIRECTION_VERTICAL) {
                actions.push(TOUCH_ACTION_PAN_X);
            }
            return actions;
        },

        directionTest(input) {
            const options = this.options;
            let hasMoved = true;
            let distance = input.distance;
            let direction = input.direction;
            const x = input.deltaX;
            const y = input.deltaY;

            // lock to axis?
            if (!(direction & options.direction)) {
                if (options.direction & DIRECTION_HORIZONTAL) {
                    direction =
                        x === 0
                            ? DIRECTION_NONE
                            : x < 0
                                ? DIRECTION_LEFT
                                : DIRECTION_RIGHT;
                    hasMoved = x != this.pX;
                    distance = Math.abs(input.deltaX);
                } else {
                    direction =
                        y === 0
                            ? DIRECTION_NONE
                            : y < 0
                                ? DIRECTION_UP
                                : DIRECTION_DOWN;
                    hasMoved = y != this.pY;
                    distance = Math.abs(input.deltaY);
                }
            }
            input.direction = direction;
            return (
                hasMoved &&
                distance > options.threshold &&
                direction & options.direction
            );
        },

        attrTest(input) {
            return (
                AttrRecognizer.prototype.attrTest.call(this, input) &&
                (this.state & STATE_BEGAN ||
                    (!(this.state & STATE_BEGAN) && this.directionTest(input)))
            );
        },

        emit(input) {
            this.pX = input.deltaX;
            this.pY = input.deltaY;

            const direction = directionStr(input.direction);

            if (direction) {
                input.additionalEvent = this.options.event + direction;
            }
            this._super.emit.call(this, input);
        }
    });

    /**
     * Pinch
     * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
     * @constructor
     * @extends AttrRecognizer
     */
    function PinchRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(PinchRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'pinch',
            threshold: 0,
            pointers: 2
        },

        getTouchAction() {
            return [TOUCH_ACTION_NONE];
        },

        attrTest(input) {
            return (
                this._super.attrTest.call(this, input) &&
                (Math.abs(input.scale - 1) > this.options.threshold ||
                    this.state & STATE_BEGAN)
            );
        },

        emit(input) {
            if (input.scale !== 1) {
                const inOut = input.scale < 1 ? 'in' : 'out';
                input.additionalEvent = this.options.event + inOut;
            }
            this._super.emit.call(this, input);
        }
    });

    /**
     * Press
     * Recognized when the pointer is down for x ms without any movement.
     * @constructor
     * @extends Recognizer
     */
    function PressRecognizer() {
        Recognizer.apply(this, arguments);

        this._timer = null;
        this._input = null;
    }

    inherit(PressRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PressRecognizer
         */
        defaults: {
            event: 'press',
            pointers: 1,
            time: 251, // minimal time of the pointer to be pressed
            threshold: 9 // a minimal movement is ok, but keep it low
        },

        getTouchAction() {
            return [TOUCH_ACTION_AUTO];
        },

        process(input) {
            const options = this.options;
            const validPointers = input.pointers.length === options.pointers;
            const validMovement = input.distance < options.threshold;
            const validTime = input.deltaTime > options.time;

            this._input = input;

            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (
                !validMovement ||
                !validPointers ||
                (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)
            ) {
                this.reset();
            } else if (input.eventType & INPUT_START) {
                this.reset();
                this._timer = setTimeoutContext(
                    function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    },
                    options.time,
                    this
                );
            } else if (input.eventType & INPUT_END) {
                return STATE_RECOGNIZED;
            }
            return STATE_FAILED;
        },

        reset() {
            clearTimeout(this._timer);
        },

        emit(input) {
            if (this.state !== STATE_RECOGNIZED) {
                return;
            }

            if (input && input.eventType & INPUT_END) {
                this.manager.emit(`${this.options.event}up`, input);
            } else {
                this._input.timeStamp = now();
                this.manager.emit(this.options.event, this._input);
            }
        }
    });

    /**
     * Rotate
     * Recognized when two or more pointer are moving in a circular motion.
     * @constructor
     * @extends AttrRecognizer
     */
    function RotateRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(RotateRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof RotateRecognizer
         */
        defaults: {
            event: 'rotate',
            threshold: 0,
            pointers: 2
        },

        getTouchAction() {
            return [TOUCH_ACTION_NONE];
        },

        attrTest(input) {
            return (
                this._super.attrTest.call(this, input) &&
                (Math.abs(input.rotation) > this.options.threshold ||
                    this.state & STATE_BEGAN)
            );
        }
    });

    /**
     * Swipe
     * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
     * @constructor
     * @extends AttrRecognizer
     */
    function SwipeRecognizer() {
        AttrRecognizer.apply(this, arguments);
    }

    inherit(SwipeRecognizer, AttrRecognizer, {
        /**
         * @namespace
         * @memberof SwipeRecognizer
         */
        defaults: {
            event: 'swipe',
            threshold: 10,
            velocity: 0.3,
            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
            pointers: 1
        },

        getTouchAction() {
            return PanRecognizer.prototype.getTouchAction.call(this);
        },

        attrTest(input) {
            const direction = this.options.direction;
            let velocity;

            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
                velocity = input.overallVelocity;
            } else if (direction & DIRECTION_HORIZONTAL) {
                velocity = input.overallVelocityX;
            } else if (direction & DIRECTION_VERTICAL) {
                velocity = input.overallVelocityY;
            }

            return (
                this._super.attrTest.call(this, input) &&
                direction & input.offsetDirection &&
                input.distance > this.options.threshold &&
                input.maxPointers == this.options.pointers &&
                abs(velocity) > this.options.velocity &&
                input.eventType & INPUT_END
            );
        },

        emit(input) {
            const direction = directionStr(input.offsetDirection);
            if (direction) {
                this.manager.emit(this.options.event + direction, input);
            }

            this.manager.emit(this.options.event, input);
        }
    });

    /**
     * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
     * between the given interval and position. The delay option can be used to recognize multi-taps without firing
     * a single tap.
     *
     * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
     * multi-taps being recognized.
     * @constructor
     * @extends Recognizer
     */
    function TapRecognizer() {
        Recognizer.apply(this, arguments);

        // previous time and center,
        // used for tap counting
        this.pTime = false;
        this.pCenter = false;

        this._timer = null;
        this._input = null;
        this.count = 0;
    }

    inherit(TapRecognizer, Recognizer, {
        /**
         * @namespace
         * @memberof PinchRecognizer
         */
        defaults: {
            event: 'tap',
            pointers: 1,
            taps: 1,
            interval: 300, // max time between the multi-tap taps
            time: 250, // max time of the pointer to be down (like finger on the screen)
            threshold: 9, // a minimal movement is ok, but keep it low
            posThreshold: 10 // a multi-tap can be a bit off the initial position
        },

        getTouchAction() {
            return [TOUCH_ACTION_MANIPULATION];
        },

        process(input) {
            const options = this.options;

            const validPointers = input.pointers.length === options.pointers;
            const validMovement = input.distance < options.threshold;
            const validTouchTime = input.deltaTime < options.time;

            this.reset();

            if (input.eventType & INPUT_START && this.count === 0) {
                return this.failTimeout();
            }

            // we only allow little movement
            // and we've reached an end event, so a tap is possible
            if (validMovement && validTouchTime && validPointers) {
                if (input.eventType != INPUT_END) {
                    return this.failTimeout();
                }

                const validInterval = this.pTime
                    ? input.timeStamp - this.pTime < options.interval
                    : true;
                const validMultiTap =
                    !this.pCenter ||
                    getDistance(this.pCenter, input.center) <
                        options.posThreshold;

                this.pTime = input.timeStamp;
                this.pCenter = input.center;

                if (!validMultiTap || !validInterval) {
                    this.count = 1;
                } else {
                    this.count += 1;
                }

                this._input = input;

                // if tap count matches we have recognized it,
                // else it has began recognizing...
                const tapCount = this.count % options.taps;
                if (tapCount === 0) {
                    // no failing requirements, immediately trigger the tap event
                    // or wait as long as the multitap interval to trigger
                    if (!this.hasRequireFailures()) {
                        return STATE_RECOGNIZED;
                    }
                    this._timer = setTimeoutContext(
                        function() {
                            this.state = STATE_RECOGNIZED;
                            this.tryEmit();
                        },
                        options.interval,
                        this
                    );
                    return STATE_BEGAN;
                }
            }
            return STATE_FAILED;
        },

        failTimeout() {
            this._timer = setTimeoutContext(
                function() {
                    this.state = STATE_FAILED;
                },
                this.options.interval,
                this
            );
            return STATE_FAILED;
        },

        reset() {
            clearTimeout(this._timer);
        },

        emit() {
            if (this.state == STATE_RECOGNIZED) {
                this._input.tapCount = this.count;
                this.manager.emit(this.options.event, this._input);
            }
        }
    });

    /**
     * Simple way to create a manager with a default set of recognizers.
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @constructor
     */
    function Hammer(element, options) {
        options = options || {};
        options.recognizers = ifUndefined(
            options.recognizers,
            Hammer.defaults.preset
        );
        return new Manager(element, options);
    }

    /**
     * @const {string}
     */
    Hammer.VERSION = '2.0.8';

    /**
     * default settings
     * @namespace
     */
    Hammer.defaults = {
        /**
         * set if DOM events are being triggered.
         * But this is slower and unused by simple implementations, so disabled by default.
         * @type {Boolean}
         * @default false
         */
        domEvents: false,

        /**
         * The value for the touchAction property/fallback.
         * When set to `compute` it will magically set the correct value based on the added recognizers.
         * @type {String}
         * @default compute
         */
        touchAction: TOUCH_ACTION_COMPUTE,

        /**
         * @type {Boolean}
         * @default true
         */
        enable: true,

        /**
         * EXPERIMENTAL FEATURE -- can be removed/changed
         * Change the parent input target element.
         * If Null, then it is being set the to main element.
         * @type {Null|EventTarget}
         * @default null
         */
        inputTarget: null,

        /**
         * force an input class
         * @type {Null|Function}
         * @default null
         */
        inputClass: null,

        /**
         * Default recognizer setup when calling `Hammer()`
         * When creating a new Manager these will be skipped.
         * @type {Array}
         */
        preset: [
            // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
            [RotateRecognizer, { enable: false }],
            [PinchRecognizer, { enable: false }, ['rotate']],
            [SwipeRecognizer, { direction: DIRECTION_HORIZONTAL }],
            [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']],
            [TapRecognizer],
            [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']],
            [PressRecognizer]
        ],

        /**
         * Some CSS properties can be used to improve the working of Hammer.
         * Add them to this method and they will be set when creating a new Manager.
         * @namespace
         */
        cssProps: {
            /**
             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userSelect: 'none',

            /**
             * Disable the Windows Phone grippers when pressing an element.
             * @type {String}
             * @default 'none'
             */
            touchSelect: 'none',

            /**
             * Disables the default callout shown when you touch and hold a touch target.
             * On iOS, when you touch and hold a touch target such as a link, Safari displays
             * a callout containing information about the link. This property allows you to disable that callout.
             * @type {String}
             * @default 'none'
             */
            touchCallout: 'none',

            /**
             * Specifies whether zooming is enabled. Used by IE10>
             * @type {String}
             * @default 'none'
             */
            contentZooming: 'none',

            /**
             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userDrag: 'none',

            /**
             * Overrides the highlight color shown when the user taps a link or a JavaScript
             * clickable element in iOS. This property obeys the alpha value, if specified.
             * @type {String}
             * @default 'rgba(0,0,0,0)'
             */
            tapHighlightColor: 'rgba(0,0,0,0)'
        }
    };

    const STOP = 1;
    const FORCED_STOP = 2;

    /**
     * Manager
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @constructor
     */
    function Manager(element, options) {
        this.options = assign({}, Hammer.defaults, options || {});

        this.options.inputTarget = this.options.inputTarget || element;

        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.oldCssProps = {};

        this.element = element;
        this.input = createInputInstance(this);
        this.touchAction = new TouchAction(this, this.options.touchAction);

        toggleCssProps(this, true);

        each(
            this.options.recognizers,
            function(item) {
                const recognizer = this.add(new item[0](item[1]));
                item[2] && recognizer.recognizeWith(item[2]);
                item[3] && recognizer.requireFailure(item[3]);
            },
            this
        );
    }

    Manager.prototype = {
        /**
         * set options
         * @param {Object} options
         * @returns {Manager}
         */
        set(options) {
            assign(this.options, options);

            // Options that need a little more setup
            if (options.touchAction) {
                this.touchAction.update();
            }
            if (options.inputTarget) {
                // Clean up existing event listeners and reinitialize
                this.input.destroy();
                this.input.target = options.inputTarget;
                this.input.init();
            }
            return this;
        },

        /**
         * stop recognizing for this session.
         * This session will be discarded, when a new [input]start event is fired.
         * When forced, the recognizer cycle is stopped immediately.
         * @param {Boolean} [force]
         */
        stop(force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
        },

        /**
         * run the recognizers!
         * called by the inputHandler function on every movement of the pointers (touches)
         * it walks through all the recognizers and tries to detect the gesture that is being made
         * @param {Object} inputData
         */
        recognize(inputData) {
            const session = this.session;
            if (session.stopped) {
                return;
            }

            // run the touch-action polyfill
            this.touchAction.preventDefaults(inputData);

            let recognizer;
            const recognizers = this.recognizers;

            // this holds the recognizer that is being recognized.
            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
            // if no recognizer is detecting a thing, it is set to `null`
            let curRecognizer = session.curRecognizer;

            // reset when the last recognizer is recognized
            // or when we're in a new session
            if (
                !curRecognizer ||
                (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)
            ) {
                curRecognizer = session.curRecognizer = null;
            }

            let i = 0;
            while (i < recognizers.length) {
                recognizer = recognizers[i];

                // find out if we are allowed try to recognize the input for this one.
                // 1.   allow if the session is NOT forced stopped (see the .stop() method)
                // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
                //      that is being recognized.
                // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
                //      this can be setup with the `recognizeWith()` method on the recognizer.
                if (
                    session.stopped !== FORCED_STOP && // 1
                    (!curRecognizer ||
                    recognizer == curRecognizer || // 2
                        recognizer.canRecognizeWith(curRecognizer))
                ) {
                    // 3
                    recognizer.recognize(inputData);
                } else {
                    recognizer.reset();
                }

                // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
                // current active recognizer. but only if we don't already have an active recognizer
                if (
                    !curRecognizer &&
                    recognizer.state &
                        (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)
                ) {
                    curRecognizer = session.curRecognizer = recognizer;
                }
                i++;
            }
        },

        /**
         * get a recognizer by its event name.
         * @param {Recognizer|String} recognizer
         * @returns {Recognizer|Null}
         */
        get(recognizer) {
            if (recognizer instanceof Recognizer) {
                return recognizer;
            }

            const recognizers = this.recognizers;
            for (let i = 0; i < recognizers.length; i++) {
                if (recognizers[i].options.event == recognizer) {
                    return recognizers[i];
                }
            }
            return null;
        },

        /**
         * add a recognizer to the manager
         * existing recognizers with the same event name will be removed
         * @param {Recognizer} recognizer
         * @returns {Recognizer|Manager}
         */
        add(recognizer) {
            if (invokeArrayArg(recognizer, 'add', this)) {
                return this;
            }

            // remove existing
            const existing = this.get(recognizer.options.event);
            if (existing) {
                this.remove(existing);
            }

            this.recognizers.push(recognizer);
            recognizer.manager = this;

            this.touchAction.update();
            return recognizer;
        },

        /**
         * remove a recognizer by name or instance
         * @param {Recognizer|String} recognizer
         * @returns {Manager}
         */
        remove(recognizer) {
            if (invokeArrayArg(recognizer, 'remove', this)) {
                return this;
            }

            recognizer = this.get(recognizer);

            // let's make sure this recognizer exists
            if (recognizer) {
                const recognizers = this.recognizers;
                const index = inArray(recognizers, recognizer);

                if (index !== -1) {
                    recognizers.splice(index, 1);
                    this.touchAction.update();
                }
            }

            return this;
        },

        /**
         * bind event
         * @param {String} events
         * @param {Function} handler
         * @returns {EventEmitter} this
         */
        on(events, handler) {
            if (events === undefined) {
                return;
            }
            if (handler === undefined) {
                return;
            }

            const handlers = this.handlers;
            each(splitStr(events), event => {
                handlers[event] = handlers[event] || [];
                handlers[event].push(handler);
            });
            return this;
        },

        /**
         * unbind event, leave emit blank to remove all handlers
         * @param {String} events
         * @param {Function} [handler]
         * @returns {EventEmitter} this
         */
        off(events, handler) {
            if (events === undefined) {
                return;
            }

            const handlers = this.handlers;
            each(splitStr(events), event => {
                if (!handler) {
                    delete handlers[event];
                } else {
                    handlers[event] &&
                        handlers[event].splice(
                            inArray(handlers[event], handler),
                            1
                        );
                }
            });
            return this;
        },

        /**
         * emit event to the listeners
         * @param {String} event
         * @param {Object} data
         */
        emit(event, data) {
            // we also want to trigger dom events
            if (this.options.domEvents) {
                triggerDomEvent(event, data);
            }

            // no handlers, so skip it all
            const handlers =
                this.handlers[event] && this.handlers[event].slice();
            if (!handlers || !handlers.length) {
                return;
            }

            data.type = event;
            data.preventDefault = function() {
                data.srcEvent.preventDefault();
            };

            let i = 0;
            while (i < handlers.length) {
                handlers[i](data);
                i++;
            }
        },

        /**
         * destroy the manager and unbinds all events
         * it doesn't unbind dom events, that is the user own responsibility
         */
        destroy() {
            this.element && toggleCssProps(this, false);

            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null;
        }
    };

    /**
     * add/remove the css properties as defined in manager.options.cssProps
     * @param {Manager} manager
     * @param {Boolean} add
     */
    function toggleCssProps(manager, add) {
        const element = manager.element;
        if (!element.style) {
            return;
        }
        let prop;
        each(manager.options.cssProps, (value, name) => {
            prop = prefixed(element.style, name);
            if (add) {
                manager.oldCssProps[prop] = element.style[prop];
                element.style[prop] = value;
            } else {
                element.style[prop] = manager.oldCssProps[prop] || '';
            }
        });
        if (!add) {
            manager.oldCssProps = {};
        }
    }

    /**
     * trigger dom event
     * @param {String} event
     * @param {Object} data
     */
    function triggerDomEvent(event, data) {
        const gestureEvent = document.createEvent('Event');
        gestureEvent.initEvent(event, true, true);
        gestureEvent.gesture = data;
        data.target.dispatchEvent(gestureEvent);
    }

    assign(Hammer, {
        INPUT_START,
        INPUT_MOVE,
        INPUT_END,
        INPUT_CANCEL,

        STATE_POSSIBLE,
        STATE_BEGAN,
        STATE_CHANGED,
        STATE_ENDED,
        STATE_RECOGNIZED,
        STATE_CANCELLED,
        STATE_FAILED,

        DIRECTION_NONE,
        DIRECTION_LEFT,
        DIRECTION_RIGHT,
        DIRECTION_UP,
        DIRECTION_DOWN,
        DIRECTION_HORIZONTAL,
        DIRECTION_VERTICAL,
        DIRECTION_ALL,

        Manager,
        Input,
        TouchAction,

        TouchInput,
        MouseInput,
        PointerEventInput,
        TouchMouseInput,
        SingleTouchInput,

        Recognizer,
        AttrRecognizer,
        Tap: TapRecognizer,
        Pan: PanRecognizer,
        Swipe: SwipeRecognizer,
        Pinch: PinchRecognizer,
        Rotate: RotateRecognizer,
        Press: PressRecognizer,

        on: addEventListeners,
        off: removeEventListeners,
        each,
        merge,
        extend,
        assign,
        inherit,
        bindFn,
        prefixed
    });

    // this prevents errors when Hammer is loaded in the presence of an AMD
    //  style loader but by script tag, not by the loader.
    const freeGlobal =
        typeof window !== 'undefined'
            ? window
            : typeof self !== 'undefined'
                ? self
                : {}; // jshint ignore:line
    freeGlobal.Hammer = Hammer;

    if (typeof define === 'function' && define.amd) {
        define(() => Hammer);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Hammer;
    } else {
        window[exportName] = Hammer;
    }
})(window, document, 'Hammer');

// Main scripts:
$(document).ready(function() {
    // DOMMouseScroll included for firefox support
    let canScroll = true;
    let scrollController = null;
    $(this).on('mousewheel DOMMouseScroll', e => {
        if (!$('.outer-nav').hasClass('is-vis')) {
            e.preventDefault();

            const delta = e.originalEvent.wheelDelta
                ? -e.originalEvent.wheelDelta
                : e.originalEvent.detail * 20;

            if (delta > 50 && canScroll) {
                canScroll = false;
                clearTimeout(scrollController);
                scrollController = setTimeout(() => {
                    canScroll = true;
                }, 800);
                updateHelper(1);
            } else if (delta < -50 && canScroll) {
                canScroll = false;
                clearTimeout(scrollController);
                scrollController = setTimeout(() => {
                    canScroll = true;
                }, 800);
                updateHelper(-1);
            }
        }
    });

    $('.side-nav li, .outer-nav li').click(function() {
        if (!$(this).hasClass('is-active')) {
            const $this = $(this);
            const curActive = $this.parent().find('.is-active');
            const curPos = $this
                .parent()
                .children()
                .index(curActive);
            const nextPos = $this
                .parent()
                .children()
                .index($this);
            const lastItem =
                $(this)
                    .parent()
                    .children().length - 1;

            updateNavs(nextPos);
            updateContent(curPos, nextPos, lastItem);
        }
    });

    $('.cta').click(() => {
        const curActive = $('.side-nav').find('.is-active');

        const curPos = $('.side-nav')
            .children()
            .index(curActive);
        const lastItem = $('.side-nav').children().length - 1;
        const nextPos = lastItem;

        updateNavs(lastItem);
        updateContent(curPos, nextPos, lastItem);
    });

    // swipe support for touch devices
    const targetElement = document.getElementById('viewport');

    const mc = new Hammer(targetElement);
    mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    mc.on('swipeup swipedown', e => {
        updateHelper(e);
    });

    $(document).keyup(e => {
        if (!$('.outer-nav').hasClass('is-vis')) {
            e.preventDefault();
            updateHelper(e);
        }
    });

    // determine scroll, swipe, and arrow key direction
    function updateHelper(param) {
        const curActive = $('.side-nav').find('.is-active');
        const curPos = $('.side-nav')
            .children()
            .index(curActive);
        const lastItem = $('.side-nav').children().length - 1;
        let nextPos = 0;

        if (param.type === 'swipeup' || param.keyCode === 40 || param > 0) {
            if (curPos !== lastItem) {
                nextPos = curPos + 1;
                updateNavs(nextPos);
                updateContent(curPos, nextPos, lastItem);
            } else {
                updateNavs(nextPos);
                updateContent(curPos, nextPos, lastItem);
            }
        } else if (
            param.type === 'swipedown' ||
            param.keyCode === 38 ||
            param < 0
        ) {
            if (curPos !== 0) {
                nextPos = curPos - 1;
                updateNavs(nextPos);
                updateContent(curPos, nextPos, lastItem);
            } else {
                nextPos = lastItem;
                updateNavs(nextPos);
                updateContent(curPos, nextPos, lastItem);
            }
        }
    }

    // sync side and outer navigations
    function updateNavs(nextPos) {
        $('.side-nav, .outer-nav')
            .children()
            .removeClass('is-active');
        $('.side-nav')
            .children()
            .eq(nextPos)
            .addClass('is-active');
        $('.outer-nav')
            .children()
            .eq(nextPos)
            .addClass('is-active');
    }

    // update main content area
    function updateContent(curPos, nextPos, lastItem) {
        $('.main-content')
            .children()
            .removeClass('section--is-active');
        $('.main-content')
            .children()
            .eq(nextPos)
            .addClass('section--is-active');
        $('.main-content .section')
            .children()
            .removeClass('section--next section--prev');

        if (
            (curPos === lastItem && nextPos === 0) ||
            (curPos === 0 && nextPos === lastItem)
        ) {
            $('.main-content .section')
                .children()
                .removeClass('section--next section--prev');
        } else if (curPos < nextPos) {
            $('.main-content')
                .children()
                .eq(curPos)
                .children()
                .addClass('section--next');
        } else {
            $('.main-content')
                .children()
                .eq(curPos)
                .children()
                .addClass('section--prev');
        }

        if (nextPos !== 0 && nextPos !== lastItem) {
            $('.header--cta').addClass('is-active');
        } else {
            $('.header--cta').removeClass('is-active');
        }
    }

    function outerNav() {
        $('.header--nav-toggle').click(() => {
            $('.perspective').addClass('perspective--modalview');
            setTimeout(() => {
                $('.perspective').addClass('effect-rotate-left--animate');
            }, 25);
            $('.outer-nav, .outer-nav li, .outer-nav--return').addClass(
                'is-vis'
            );
        });

        $('.outer-nav--return, .outer-nav li').click(() => {
            $('.perspective').removeClass('effect-rotate-left--animate');
            setTimeout(() => {
                $('.perspective').removeClass('perspective--modalview');
            }, 400);
            $('.outer-nav, .outer-nav li, .outer-nav--return').removeClass(
                'is-vis'
            );
        });
    }

    function workSlider() {
        $('.slider--prev, .slider--next').click(function() {
            const $this = $(this);
            const curLeft = $('.slider').find('.slider--item-left');

            const curLeftPos = $('.slider')
                .children()
                .index(curLeft);
            const curCenter = $('.slider').find('.slider--item-center');

            const curCenterPos = $('.slider')
                .children()
                .index(curCenter);

            const curRight = $('.slider').find('.slider--item-right');
            const curRightPos = $('.slider')
                .children()
                .index(curRight);

            const totalWorks = $('.slider').children().length;

            const $left = $('.slider--item-left');

            const $center = $('.slider--item-center');

            const $right = $('.slider--item-right');
            const $item = $('.slider--item');

            $('.slider').animate({ opacity: 0 }, 400);

            setTimeout(() => {
                if ($this.hasClass('slider--next')) {
                    if (
                        curLeftPos < totalWorks - 1 &&
                        curCenterPos < totalWorks - 1 &&
                        curRightPos < totalWorks - 1
                    ) {
                        $left
                            .removeClass('slider--item-left')
                            .next()
                            .addClass('slider--item-left');
                        $center
                            .removeClass('slider--item-center')
                            .next()
                            .addClass('slider--item-center');
                        $right
                            .removeClass('slider--item-right')
                            .next()
                            .addClass('slider--item-right');
                    } else if (curLeftPos === totalWorks - 1) {
                        $item
                            .removeClass('slider--item-left')
                            .first()
                            .addClass('slider--item-left');
                        $center
                            .removeClass('slider--item-center')
                            .next()
                            .addClass('slider--item-center');
                        $right
                            .removeClass('slider--item-right')
                            .next()
                            .addClass('slider--item-right');
                    } else if (curCenterPos === totalWorks - 1) {
                        $left
                            .removeClass('slider--item-left')
                            .next()
                            .addClass('slider--item-left');
                        $item
                            .removeClass('slider--item-center')
                            .first()
                            .addClass('slider--item-center');
                        $right
                            .removeClass('slider--item-right')
                            .next()
                            .addClass('slider--item-right');
                    } else {
                        $left
                            .removeClass('slider--item-left')
                            .next()
                            .addClass('slider--item-left');
                        $center
                            .removeClass('slider--item-center')
                            .next()
                            .addClass('slider--item-center');
                        $item
                            .removeClass('slider--item-right')
                            .first()
                            .addClass('slider--item-right');
                    }
                } else if (
                    curLeftPos !== 0 &&
                    curCenterPos !== 0 &&
                    curRightPos !== 0
                ) {
                    $left
                        .removeClass('slider--item-left')
                        .prev()
                        .addClass('slider--item-left');
                    $center
                        .removeClass('slider--item-center')
                        .prev()
                        .addClass('slider--item-center');
                    $right
                        .removeClass('slider--item-right')
                        .prev()
                        .addClass('slider--item-right');
                } else if (curLeftPos === 0) {
                    $item
                        .removeClass('slider--item-left')
                        .last()
                        .addClass('slider--item-left');
                    $center
                        .removeClass('slider--item-center')
                        .prev()
                        .addClass('slider--item-center');
                    $right
                        .removeClass('slider--item-right')
                        .prev()
                        .addClass('slider--item-right');
                } else if (curCenterPos === 0) {
                    $left
                        .removeClass('slider--item-left')
                        .prev()
                        .addClass('slider--item-left');
                    $item
                        .removeClass('slider--item-center')
                        .last()
                        .addClass('slider--item-center');
                    $right
                        .removeClass('slider--item-right')
                        .prev()
                        .addClass('slider--item-right');
                } else {
                    $left
                        .removeClass('slider--item-left')
                        .prev()
                        .addClass('slider--item-left');
                    $center
                        .removeClass('slider--item-center')
                        .prev()
                        .addClass('slider--item-center');
                    $item
                        .removeClass('slider--item-right')
                        .last()
                        .addClass('slider--item-right');
                }
            }, 400);

            $('.slider').animate({ opacity: 1 }, 400);
        });
    }

    function transitionLabels() {
        $('.work-request--information input').focusout(function() {
            const textVal = $(this).val();

            if (textVal === '') {
                $(this).removeClass('has-value');
            } else {
                $(this).addClass('has-value');
            }

            // correct mobile device window position
            window.scrollTo(0, 0);
        });
    }

    outerNav();
    workSlider();
    transitionLabels();
});
