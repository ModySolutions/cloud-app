/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/@alpinejs+mask@3.14.8/node_modules/@alpinejs/mask/dist/module.esm.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@alpinejs+mask@3.14.8/node_modules/@alpinejs/mask/dist/module.esm.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ module_default),
/* harmony export */   mask: () => (/* binding */ src_default),
/* harmony export */   stripDown: () => (/* binding */ stripDown)
/* harmony export */ });
// packages/mask/src/index.js
function src_default(Alpine) {
  Alpine.directive("mask", (el, { value, expression }, { effect, evaluateLater, cleanup }) => {
    let templateFn = () => expression;
    let lastInputValue = "";
    queueMicrotask(() => {
      if (["function", "dynamic"].includes(value)) {
        let evaluator = evaluateLater(expression);
        effect(() => {
          templateFn = (input) => {
            let result;
            Alpine.dontAutoEvaluateFunctions(() => {
              evaluator((value2) => {
                result = typeof value2 === "function" ? value2(input) : value2;
              }, { scope: {
                // These are "magics" we'll make available to the x-mask:function:
                "$input": input,
                "$money": formatMoney.bind({ el })
              } });
            });
            return result;
          };
          processInputValue(el, false);
        });
      } else {
        processInputValue(el, false);
      }
      if (el._x_model) {
        if (el._x_model.get() === el.value)
          return;
        if (el._x_model.get() === null && el.value === "")
          return;
        el._x_model.set(el.value);
      }
    });
    const controller = new AbortController();
    cleanup(() => {
      controller.abort();
    });
    el.addEventListener("input", () => processInputValue(el), {
      signal: controller.signal,
      // Setting this as a capture phase listener to ensure it runs
      // before wire:model or x-model added as a latent binding...
      capture: true
    });
    el.addEventListener("blur", () => processInputValue(el, false), { signal: controller.signal });
    function processInputValue(el2, shouldRestoreCursor = true) {
      let input = el2.value;
      let template = templateFn(input);
      if (!template || template === "false")
        return false;
      if (lastInputValue.length - el2.value.length === 1) {
        return lastInputValue = el2.value;
      }
      let setInput = () => {
        lastInputValue = el2.value = formatInput(input, template);
      };
      if (shouldRestoreCursor) {
        restoreCursorPosition(el2, template, () => {
          setInput();
        });
      } else {
        setInput();
      }
    }
    function formatInput(input, template) {
      if (input === "")
        return "";
      let strippedDownInput = stripDown(template, input);
      let rebuiltInput = buildUp(template, strippedDownInput);
      return rebuiltInput;
    }
  }).before("model");
}
function restoreCursorPosition(el, template, callback) {
  let cursorPosition = el.selectionStart;
  let unformattedValue = el.value;
  callback();
  let beforeLeftOfCursorBeforeFormatting = unformattedValue.slice(0, cursorPosition);
  let newPosition = buildUp(
    template,
    stripDown(
      template,
      beforeLeftOfCursorBeforeFormatting
    )
  ).length;
  el.setSelectionRange(newPosition, newPosition);
}
function stripDown(template, input) {
  let inputToBeStripped = input;
  let output = "";
  let regexes = {
    "9": /[0-9]/,
    "a": /[a-zA-Z]/,
    "*": /[a-zA-Z0-9]/
  };
  let wildcardTemplate = "";
  for (let i = 0; i < template.length; i++) {
    if (["9", "a", "*"].includes(template[i])) {
      wildcardTemplate += template[i];
      continue;
    }
    for (let j = 0; j < inputToBeStripped.length; j++) {
      if (inputToBeStripped[j] === template[i]) {
        inputToBeStripped = inputToBeStripped.slice(0, j) + inputToBeStripped.slice(j + 1);
        break;
      }
    }
  }
  for (let i = 0; i < wildcardTemplate.length; i++) {
    let found = false;
    for (let j = 0; j < inputToBeStripped.length; j++) {
      if (regexes[wildcardTemplate[i]].test(inputToBeStripped[j])) {
        output += inputToBeStripped[j];
        inputToBeStripped = inputToBeStripped.slice(0, j) + inputToBeStripped.slice(j + 1);
        found = true;
        break;
      }
    }
    if (!found)
      break;
  }
  return output;
}
function buildUp(template, input) {
  let clean = Array.from(input);
  let output = "";
  for (let i = 0; i < template.length; i++) {
    if (!["9", "a", "*"].includes(template[i])) {
      output += template[i];
      continue;
    }
    if (clean.length === 0)
      break;
    output += clean.shift();
  }
  return output;
}
function formatMoney(input, delimiter = ".", thousands, precision = 2) {
  if (input === "-")
    return "-";
  if (/^\D+$/.test(input))
    return "9";
  if (thousands === null || thousands === void 0) {
    thousands = delimiter === "," ? "." : ",";
  }
  let addThousands = (input2, thousands2) => {
    let output = "";
    let counter = 0;
    for (let i = input2.length - 1; i >= 0; i--) {
      if (input2[i] === thousands2)
        continue;
      if (counter === 3) {
        output = input2[i] + thousands2 + output;
        counter = 0;
      } else {
        output = input2[i] + output;
      }
      counter++;
    }
    return output;
  };
  let minus = input.startsWith("-") ? "-" : "";
  let strippedInput = input.replaceAll(new RegExp(`[^0-9\\${delimiter}]`, "g"), "");
  let template = Array.from({ length: strippedInput.split(delimiter)[0].length }).fill("9").join("");
  template = `${minus}${addThousands(template, thousands)}`;
  if (precision > 0 && input.includes(delimiter))
    template += `${delimiter}` + "9".repeat(precision);
  queueMicrotask(() => {
    if (this.el.value.endsWith(delimiter))
      return;
    if (this.el.value[this.el.selectionStart - 1] === delimiter) {
      this.el.setSelectionRange(this.el.selectionStart - 1, this.el.selectionStart - 1);
    }
  });
  return template;
}

// packages/mask/builds/module.js
var module_default = src_default;



/***/ }),

/***/ "./node_modules/.pnpm/alpinejs@3.14.8/node_modules/alpinejs/dist/module.esm.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/alpinejs@3.14.8/node_modules/alpinejs/dist/module.esm.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alpine: () => (/* binding */ src_default),
/* harmony export */   "default": () => (/* binding */ module_default)
/* harmony export */ });
// packages/alpinejs/src/scheduler.js
var flushPending = false;
var flushing = false;
var queue = [];
var lastFlushedIndex = -1;
function scheduler(callback) {
  queueJob(callback);
}
function queueJob(job) {
  if (!queue.includes(job))
    queue.push(job);
  queueFlush();
}
function dequeueJob(job) {
  let index = queue.indexOf(job);
  if (index !== -1 && index > lastFlushedIndex)
    queue.splice(index, 1);
}
function queueFlush() {
  if (!flushing && !flushPending) {
    flushPending = true;
    queueMicrotask(flushJobs);
  }
}
function flushJobs() {
  flushPending = false;
  flushing = true;
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
    lastFlushedIndex = i;
  }
  queue.length = 0;
  lastFlushedIndex = -1;
  flushing = false;
}

// packages/alpinejs/src/reactivity.js
var reactive;
var effect;
var release;
var raw;
var shouldSchedule = true;
function disableEffectScheduling(callback) {
  shouldSchedule = false;
  callback();
  shouldSchedule = true;
}
function setReactivityEngine(engine) {
  reactive = engine.reactive;
  release = engine.release;
  effect = (callback) => engine.effect(callback, { scheduler: (task) => {
    if (shouldSchedule) {
      scheduler(task);
    } else {
      task();
    }
  } });
  raw = engine.raw;
}
function overrideEffect(override) {
  effect = override;
}
function elementBoundEffect(el) {
  let cleanup2 = () => {
  };
  let wrappedEffect = (callback) => {
    let effectReference = effect(callback);
    if (!el._x_effects) {
      el._x_effects = /* @__PURE__ */ new Set();
      el._x_runEffects = () => {
        el._x_effects.forEach((i) => i());
      };
    }
    el._x_effects.add(effectReference);
    cleanup2 = () => {
      if (effectReference === void 0)
        return;
      el._x_effects.delete(effectReference);
      release(effectReference);
    };
    return effectReference;
  };
  return [wrappedEffect, () => {
    cleanup2();
  }];
}
function watch(getter, callback) {
  let firstTime = true;
  let oldValue;
  let effectReference = effect(() => {
    let value = getter();
    JSON.stringify(value);
    if (!firstTime) {
      queueMicrotask(() => {
        callback(value, oldValue);
        oldValue = value;
      });
    } else {
      oldValue = value;
    }
    firstTime = false;
  });
  return () => release(effectReference);
}

// packages/alpinejs/src/mutation.js
var onAttributeAddeds = [];
var onElRemoveds = [];
var onElAddeds = [];
function onElAdded(callback) {
  onElAddeds.push(callback);
}
function onElRemoved(el, callback) {
  if (typeof callback === "function") {
    if (!el._x_cleanups)
      el._x_cleanups = [];
    el._x_cleanups.push(callback);
  } else {
    callback = el;
    onElRemoveds.push(callback);
  }
}
function onAttributesAdded(callback) {
  onAttributeAddeds.push(callback);
}
function onAttributeRemoved(el, name, callback) {
  if (!el._x_attributeCleanups)
    el._x_attributeCleanups = {};
  if (!el._x_attributeCleanups[name])
    el._x_attributeCleanups[name] = [];
  el._x_attributeCleanups[name].push(callback);
}
function cleanupAttributes(el, names) {
  if (!el._x_attributeCleanups)
    return;
  Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
    if (names === void 0 || names.includes(name)) {
      value.forEach((i) => i());
      delete el._x_attributeCleanups[name];
    }
  });
}
function cleanupElement(el) {
  el._x_effects?.forEach(dequeueJob);
  while (el._x_cleanups?.length)
    el._x_cleanups.pop()();
}
var observer = new MutationObserver(onMutate);
var currentlyObserving = false;
function startObservingMutations() {
  observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
  currentlyObserving = true;
}
function stopObservingMutations() {
  flushObserver();
  observer.disconnect();
  currentlyObserving = false;
}
var queuedMutations = [];
function flushObserver() {
  let records = observer.takeRecords();
  queuedMutations.push(() => records.length > 0 && onMutate(records));
  let queueLengthWhenTriggered = queuedMutations.length;
  queueMicrotask(() => {
    if (queuedMutations.length === queueLengthWhenTriggered) {
      while (queuedMutations.length > 0)
        queuedMutations.shift()();
    }
  });
}
function mutateDom(callback) {
  if (!currentlyObserving)
    return callback();
  stopObservingMutations();
  let result = callback();
  startObservingMutations();
  return result;
}
var isCollecting = false;
var deferredMutations = [];
function deferMutations() {
  isCollecting = true;
}
function flushAndStopDeferringMutations() {
  isCollecting = false;
  onMutate(deferredMutations);
  deferredMutations = [];
}
function onMutate(mutations) {
  if (isCollecting) {
    deferredMutations = deferredMutations.concat(mutations);
    return;
  }
  let addedNodes = [];
  let removedNodes = /* @__PURE__ */ new Set();
  let addedAttributes = /* @__PURE__ */ new Map();
  let removedAttributes = /* @__PURE__ */ new Map();
  for (let i = 0; i < mutations.length; i++) {
    if (mutations[i].target._x_ignoreMutationObserver)
      continue;
    if (mutations[i].type === "childList") {
      mutations[i].removedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (!node._x_marker)
          return;
        removedNodes.add(node);
      });
      mutations[i].addedNodes.forEach((node) => {
        if (node.nodeType !== 1)
          return;
        if (removedNodes.has(node)) {
          removedNodes.delete(node);
          return;
        }
        if (node._x_marker)
          return;
        addedNodes.push(node);
      });
    }
    if (mutations[i].type === "attributes") {
      let el = mutations[i].target;
      let name = mutations[i].attributeName;
      let oldValue = mutations[i].oldValue;
      let add2 = () => {
        if (!addedAttributes.has(el))
          addedAttributes.set(el, []);
        addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
      };
      let remove = () => {
        if (!removedAttributes.has(el))
          removedAttributes.set(el, []);
        removedAttributes.get(el).push(name);
      };
      if (el.hasAttribute(name) && oldValue === null) {
        add2();
      } else if (el.hasAttribute(name)) {
        remove();
        add2();
      } else {
        remove();
      }
    }
  }
  removedAttributes.forEach((attrs, el) => {
    cleanupAttributes(el, attrs);
  });
  addedAttributes.forEach((attrs, el) => {
    onAttributeAddeds.forEach((i) => i(el, attrs));
  });
  for (let node of removedNodes) {
    if (addedNodes.some((i) => i.contains(node)))
      continue;
    onElRemoveds.forEach((i) => i(node));
  }
  for (let node of addedNodes) {
    if (!node.isConnected)
      continue;
    onElAddeds.forEach((i) => i(node));
  }
  addedNodes = null;
  removedNodes = null;
  addedAttributes = null;
  removedAttributes = null;
}

// packages/alpinejs/src/scope.js
function scope(node) {
  return mergeProxies(closestDataStack(node));
}
function addScopeToNode(node, data2, referenceNode) {
  node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
  return () => {
    node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
  };
}
function closestDataStack(node) {
  if (node._x_dataStack)
    return node._x_dataStack;
  if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
    return closestDataStack(node.host);
  }
  if (!node.parentNode) {
    return [];
  }
  return closestDataStack(node.parentNode);
}
function mergeProxies(objects) {
  return new Proxy({ objects }, mergeProxyTrap);
}
var mergeProxyTrap = {
  ownKeys({ objects }) {
    return Array.from(
      new Set(objects.flatMap((i) => Object.keys(i)))
    );
  },
  has({ objects }, name) {
    if (name == Symbol.unscopables)
      return false;
    return objects.some(
      (obj) => Object.prototype.hasOwnProperty.call(obj, name) || Reflect.has(obj, name)
    );
  },
  get({ objects }, name, thisProxy) {
    if (name == "toJSON")
      return collapseProxies;
    return Reflect.get(
      objects.find(
        (obj) => Reflect.has(obj, name)
      ) || {},
      name,
      thisProxy
    );
  },
  set({ objects }, name, value, thisProxy) {
    const target = objects.find(
      (obj) => Object.prototype.hasOwnProperty.call(obj, name)
    ) || objects[objects.length - 1];
    const descriptor = Object.getOwnPropertyDescriptor(target, name);
    if (descriptor?.set && descriptor?.get)
      return descriptor.set.call(thisProxy, value) || true;
    return Reflect.set(target, name, value);
  }
};
function collapseProxies() {
  let keys = Reflect.ownKeys(this);
  return keys.reduce((acc, key) => {
    acc[key] = Reflect.get(this, key);
    return acc;
  }, {});
}

// packages/alpinejs/src/interceptor.js
function initInterceptors(data2) {
  let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
  let recurse = (obj, basePath = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
      if (enumerable === false || value === void 0)
        return;
      if (typeof value === "object" && value !== null && value.__v_skip)
        return;
      let path = basePath === "" ? key : `${basePath}.${key}`;
      if (typeof value === "object" && value !== null && value._x_interceptor) {
        obj[key] = value.initialize(data2, path, key);
      } else {
        if (isObject2(value) && value !== obj && !(value instanceof Element)) {
          recurse(value, path);
        }
      }
    });
  };
  return recurse(data2);
}
function interceptor(callback, mutateObj = () => {
}) {
  let obj = {
    initialValue: void 0,
    _x_interceptor: true,
    initialize(data2, path, key) {
      return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
    }
  };
  mutateObj(obj);
  return (initialValue) => {
    if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
      let initialize = obj.initialize.bind(obj);
      obj.initialize = (data2, path, key) => {
        let innerValue = initialValue.initialize(data2, path, key);
        obj.initialValue = innerValue;
        return initialize(data2, path, key);
      };
    } else {
      obj.initialValue = initialValue;
    }
    return obj;
  };
}
function get(obj, path) {
  return path.split(".").reduce((carry, segment) => carry[segment], obj);
}
function set(obj, path, value) {
  if (typeof path === "string")
    path = path.split(".");
  if (path.length === 1)
    obj[path[0]] = value;
  else if (path.length === 0)
    throw error;
  else {
    if (obj[path[0]])
      return set(obj[path[0]], path.slice(1), value);
    else {
      obj[path[0]] = {};
      return set(obj[path[0]], path.slice(1), value);
    }
  }
}

// packages/alpinejs/src/magics.js
var magics = {};
function magic(name, callback) {
  magics[name] = callback;
}
function injectMagics(obj, el) {
  let memoizedUtilities = getUtilities(el);
  Object.entries(magics).forEach(([name, callback]) => {
    Object.defineProperty(obj, `$${name}`, {
      get() {
        return callback(el, memoizedUtilities);
      },
      enumerable: false
    });
  });
  return obj;
}
function getUtilities(el) {
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  let utils = { interceptor, ...utilities };
  onElRemoved(el, cleanup2);
  return utils;
}

// packages/alpinejs/src/utils/error.js
function tryCatch(el, expression, callback, ...args) {
  try {
    return callback(...args);
  } catch (e) {
    handleError(e, el, expression);
  }
}
function handleError(error2, el, expression = void 0) {
  error2 = Object.assign(
    error2 ?? { message: "No error message given." },
    { el, expression }
  );
  console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
  setTimeout(() => {
    throw error2;
  }, 0);
}

// packages/alpinejs/src/evaluator.js
var shouldAutoEvaluateFunctions = true;
function dontAutoEvaluateFunctions(callback) {
  let cache = shouldAutoEvaluateFunctions;
  shouldAutoEvaluateFunctions = false;
  let result = callback();
  shouldAutoEvaluateFunctions = cache;
  return result;
}
function evaluate(el, expression, extras = {}) {
  let result;
  evaluateLater(el, expression)((value) => result = value, extras);
  return result;
}
function evaluateLater(...args) {
  return theEvaluatorFunction(...args);
}
var theEvaluatorFunction = normalEvaluator;
function setEvaluator(newEvaluator) {
  theEvaluatorFunction = newEvaluator;
}
function normalEvaluator(el, expression) {
  let overriddenMagics = {};
  injectMagics(overriddenMagics, el);
  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  let evaluator = typeof expression === "function" ? generateEvaluatorFromFunction(dataStack, expression) : generateEvaluatorFromString(dataStack, expression, el);
  return tryCatch.bind(null, el, expression, evaluator);
}
function generateEvaluatorFromFunction(dataStack, func) {
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [] } = {}) => {
    let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
    runIfTypeOfFunction(receiver, result);
  };
}
var evaluatorMemo = {};
function generateFunctionFromString(expression, el) {
  if (evaluatorMemo[expression]) {
    return evaluatorMemo[expression];
  }
  let AsyncFunction = Object.getPrototypeOf(async function() {
  }).constructor;
  let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression.trim()) || /^(let|const)\s/.test(expression.trim()) ? `(async()=>{ ${expression} })()` : expression;
  const safeAsyncFunction = () => {
    try {
      let func2 = new AsyncFunction(
        ["__self", "scope"],
        `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`
      );
      Object.defineProperty(func2, "name", {
        value: `[Alpine] ${expression}`
      });
      return func2;
    } catch (error2) {
      handleError(error2, el, expression);
      return Promise.resolve();
    }
  };
  let func = safeAsyncFunction();
  evaluatorMemo[expression] = func;
  return func;
}
function generateEvaluatorFromString(dataStack, expression, el) {
  let func = generateFunctionFromString(expression, el);
  return (receiver = () => {
  }, { scope: scope2 = {}, params = [] } = {}) => {
    func.result = void 0;
    func.finished = false;
    let completeScope = mergeProxies([scope2, ...dataStack]);
    if (typeof func === "function") {
      let promise = func(func, completeScope).catch((error2) => handleError(error2, el, expression));
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
        func.result = void 0;
      } else {
        promise.then((result) => {
          runIfTypeOfFunction(receiver, result, completeScope, params, el);
        }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
      }
    }
  };
}
function runIfTypeOfFunction(receiver, value, scope2, params, el) {
  if (shouldAutoEvaluateFunctions && typeof value === "function") {
    let result = value.apply(scope2, params);
    if (result instanceof Promise) {
      result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
    } else {
      receiver(result);
    }
  } else if (typeof value === "object" && value instanceof Promise) {
    value.then((i) => receiver(i));
  } else {
    receiver(value);
  }
}

// packages/alpinejs/src/directives.js
var prefixAsString = "x-";
function prefix(subject = "") {
  return prefixAsString + subject;
}
function setPrefix(newPrefix) {
  prefixAsString = newPrefix;
}
var directiveHandlers = {};
function directive(name, callback) {
  directiveHandlers[name] = callback;
  return {
    before(directive2) {
      if (!directiveHandlers[directive2]) {
        console.warn(String.raw`Cannot find directive \`${directive2}\`. \`${name}\` will use the default order of execution`);
        return;
      }
      const pos = directiveOrder.indexOf(directive2);
      directiveOrder.splice(pos >= 0 ? pos : directiveOrder.indexOf("DEFAULT"), 0, name);
    }
  };
}
function directiveExists(name) {
  return Object.keys(directiveHandlers).includes(name);
}
function directives(el, attributes, originalAttributeOverride) {
  attributes = Array.from(attributes);
  if (el._x_virtualDirectives) {
    let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({ name, value }));
    let staticAttributes = attributesOnly(vAttributes);
    vAttributes = vAttributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    attributes = attributes.concat(vAttributes);
  }
  let transformedAttributeMap = {};
  let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
  return directives2.map((directive2) => {
    return getDirectiveHandler(el, directive2);
  });
}
function attributesOnly(attributes) {
  return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
}
var isDeferringHandlers = false;
var directiveHandlerStacks = /* @__PURE__ */ new Map();
var currentHandlerStackKey = Symbol();
function deferHandlingDirectives(callback) {
  isDeferringHandlers = true;
  let key = Symbol();
  currentHandlerStackKey = key;
  directiveHandlerStacks.set(key, []);
  let flushHandlers = () => {
    while (directiveHandlerStacks.get(key).length)
      directiveHandlerStacks.get(key).shift()();
    directiveHandlerStacks.delete(key);
  };
  let stopDeferring = () => {
    isDeferringHandlers = false;
    flushHandlers();
  };
  callback(flushHandlers);
  stopDeferring();
}
function getElementBoundUtilities(el) {
  let cleanups = [];
  let cleanup2 = (callback) => cleanups.push(callback);
  let [effect3, cleanupEffect] = elementBoundEffect(el);
  cleanups.push(cleanupEffect);
  let utilities = {
    Alpine: alpine_default,
    effect: effect3,
    cleanup: cleanup2,
    evaluateLater: evaluateLater.bind(evaluateLater, el),
    evaluate: evaluate.bind(evaluate, el)
  };
  let doCleanup = () => cleanups.forEach((i) => i());
  return [utilities, doCleanup];
}
function getDirectiveHandler(el, directive2) {
  let noop = () => {
  };
  let handler4 = directiveHandlers[directive2.type] || noop;
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  onAttributeRemoved(el, directive2.original, cleanup2);
  let fullHandler = () => {
    if (el._x_ignore || el._x_ignoreSelf)
      return;
    handler4.inline && handler4.inline(el, directive2, utilities);
    handler4 = handler4.bind(handler4, el, directive2, utilities);
    isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler4) : handler4();
  };
  fullHandler.runCleanups = cleanup2;
  return fullHandler;
}
var startingWith = (subject, replacement) => ({ name, value }) => {
  if (name.startsWith(subject))
    name = name.replace(subject, replacement);
  return { name, value };
};
var into = (i) => i;
function toTransformedAttributes(callback = () => {
}) {
  return ({ name, value }) => {
    let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
      return transform(carry);
    }, { name, value });
    if (newName !== name)
      callback(newName, name);
    return { name: newName, value: newValue };
  };
}
var attributeTransformers = [];
function mapAttributes(callback) {
  attributeTransformers.push(callback);
}
function outNonAlpineAttributes({ name }) {
  return alpineAttributeRegex().test(name);
}
var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
  return ({ name, value }) => {
    let typeMatch = name.match(alpineAttributeRegex());
    let valueMatch = name.match(/:([a-zA-Z0-9\-_:]+)/);
    let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    let original = originalAttributeOverride || transformedAttributeMap[name] || name;
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map((i) => i.replace(".", "")),
      expression: value,
      original
    };
  };
}
var DEFAULT = "DEFAULT";
var directiveOrder = [
  "ignore",
  "ref",
  "data",
  "id",
  "anchor",
  "bind",
  "init",
  "for",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  DEFAULT,
  "teleport"
];
function byPriority(a, b) {
  let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
  let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
  return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
}

// packages/alpinejs/src/utils/dispatch.js
function dispatch(el, name, detail = {}) {
  el.dispatchEvent(
    new CustomEvent(name, {
      detail,
      bubbles: true,
      // Allows events to pass the shadow DOM barrier.
      composed: true,
      cancelable: true
    })
  );
}

// packages/alpinejs/src/utils/walk.js
function walk(el, callback) {
  if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
    Array.from(el.children).forEach((el2) => walk(el2, callback));
    return;
  }
  let skip = false;
  callback(el, () => skip = true);
  if (skip)
    return;
  let node = el.firstElementChild;
  while (node) {
    walk(node, callback, false);
    node = node.nextElementSibling;
  }
}

// packages/alpinejs/src/utils/warn.js
function warn(message, ...args) {
  console.warn(`Alpine Warning: ${message}`, ...args);
}

// packages/alpinejs/src/lifecycle.js
var started = false;
function start() {
  if (started)
    warn("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.");
  started = true;
  if (!document.body)
    warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
  dispatch(document, "alpine:init");
  dispatch(document, "alpine:initializing");
  startObservingMutations();
  onElAdded((el) => initTree(el, walk));
  onElRemoved((el) => destroyTree(el));
  onAttributesAdded((el, attrs) => {
    directives(el, attrs).forEach((handle) => handle());
  });
  let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
  Array.from(document.querySelectorAll(allSelectors().join(","))).filter(outNestedComponents).forEach((el) => {
    initTree(el);
  });
  dispatch(document, "alpine:initialized");
  setTimeout(() => {
    warnAboutMissingPlugins();
  });
}
var rootSelectorCallbacks = [];
var initSelectorCallbacks = [];
function rootSelectors() {
  return rootSelectorCallbacks.map((fn) => fn());
}
function allSelectors() {
  return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
}
function addRootSelector(selectorCallback) {
  rootSelectorCallbacks.push(selectorCallback);
}
function addInitSelector(selectorCallback) {
  initSelectorCallbacks.push(selectorCallback);
}
function closestRoot(el, includeInitSelectors = false) {
  return findClosest(el, (element) => {
    const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
    if (selectors.some((selector) => element.matches(selector)))
      return true;
  });
}
function findClosest(el, callback) {
  if (!el)
    return;
  if (callback(el))
    return el;
  if (el._x_teleportBack)
    el = el._x_teleportBack;
  if (!el.parentElement)
    return;
  return findClosest(el.parentElement, callback);
}
function isRoot(el) {
  return rootSelectors().some((selector) => el.matches(selector));
}
var initInterceptors2 = [];
function interceptInit(callback) {
  initInterceptors2.push(callback);
}
var markerDispenser = 1;
function initTree(el, walker = walk, intercept = () => {
}) {
  if (findClosest(el, (i) => i._x_ignore))
    return;
  deferHandlingDirectives(() => {
    walker(el, (el2, skip) => {
      if (el2._x_marker)
        return;
      intercept(el2, skip);
      initInterceptors2.forEach((i) => i(el2, skip));
      directives(el2, el2.attributes).forEach((handle) => handle());
      if (!el2._x_ignore)
        el2._x_marker = markerDispenser++;
      el2._x_ignore && skip();
    });
  });
}
function destroyTree(root, walker = walk) {
  walker(root, (el) => {
    cleanupElement(el);
    cleanupAttributes(el);
    delete el._x_marker;
  });
}
function warnAboutMissingPlugins() {
  let pluginDirectives = [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ];
  pluginDirectives.forEach(([plugin2, directive2, selectors]) => {
    if (directiveExists(directive2))
      return;
    selectors.some((selector) => {
      if (document.querySelector(selector)) {
        warn(`found "${selector}", but missing ${plugin2} plugin`);
        return true;
      }
    });
  });
}

// packages/alpinejs/src/nextTick.js
var tickStack = [];
var isHolding = false;
function nextTick(callback = () => {
}) {
  queueMicrotask(() => {
    isHolding || setTimeout(() => {
      releaseNextTicks();
    });
  });
  return new Promise((res) => {
    tickStack.push(() => {
      callback();
      res();
    });
  });
}
function releaseNextTicks() {
  isHolding = false;
  while (tickStack.length)
    tickStack.shift()();
}
function holdNextTicks() {
  isHolding = true;
}

// packages/alpinejs/src/utils/classes.js
function setClasses(el, value) {
  if (Array.isArray(value)) {
    return setClassesFromString(el, value.join(" "));
  } else if (typeof value === "object" && value !== null) {
    return setClassesFromObject(el, value);
  } else if (typeof value === "function") {
    return setClasses(el, value());
  }
  return setClassesFromString(el, value);
}
function setClassesFromString(el, classString) {
  let split = (classString2) => classString2.split(" ").filter(Boolean);
  let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
  let addClassesAndReturnUndo = (classes) => {
    el.classList.add(...classes);
    return () => {
      el.classList.remove(...classes);
    };
  };
  classString = classString === true ? classString = "" : classString || "";
  return addClassesAndReturnUndo(missingClasses(classString));
}
function setClassesFromObject(el, classObject) {
  let split = (classString) => classString.split(" ").filter(Boolean);
  let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
  let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
  let added = [];
  let removed = [];
  forRemove.forEach((i) => {
    if (el.classList.contains(i)) {
      el.classList.remove(i);
      removed.push(i);
    }
  });
  forAdd.forEach((i) => {
    if (!el.classList.contains(i)) {
      el.classList.add(i);
      added.push(i);
    }
  });
  return () => {
    removed.forEach((i) => el.classList.add(i));
    added.forEach((i) => el.classList.remove(i));
  };
}

// packages/alpinejs/src/utils/styles.js
function setStyles(el, value) {
  if (typeof value === "object" && value !== null) {
    return setStylesFromObject(el, value);
  }
  return setStylesFromString(el, value);
}
function setStylesFromObject(el, value) {
  let previousStyles = {};
  Object.entries(value).forEach(([key, value2]) => {
    previousStyles[key] = el.style[key];
    if (!key.startsWith("--")) {
      key = kebabCase(key);
    }
    el.style.setProperty(key, value2);
  });
  setTimeout(() => {
    if (el.style.length === 0) {
      el.removeAttribute("style");
    }
  });
  return () => {
    setStyles(el, previousStyles);
  };
}
function setStylesFromString(el, value) {
  let cache = el.getAttribute("style", value);
  el.setAttribute("style", value);
  return () => {
    el.setAttribute("style", cache || "");
  };
}
function kebabCase(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// packages/alpinejs/src/utils/once.js
function once(callback, fallback = () => {
}) {
  let called = false;
  return function() {
    if (!called) {
      called = true;
      callback.apply(this, arguments);
    } else {
      fallback.apply(this, arguments);
    }
  };
}

// packages/alpinejs/src/directives/x-transition.js
directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "function")
    expression = evaluate2(expression);
  if (expression === false)
    return;
  if (!expression || typeof expression === "boolean") {
    registerTransitionsFromHelper(el, modifiers, value);
  } else {
    registerTransitionsFromClassString(el, expression, value);
  }
});
function registerTransitionsFromClassString(el, classString, stage) {
  registerTransitionObject(el, setClasses, "");
  let directiveStorageMap = {
    "enter": (classes) => {
      el._x_transition.enter.during = classes;
    },
    "enter-start": (classes) => {
      el._x_transition.enter.start = classes;
    },
    "enter-end": (classes) => {
      el._x_transition.enter.end = classes;
    },
    "leave": (classes) => {
      el._x_transition.leave.during = classes;
    },
    "leave-start": (classes) => {
      el._x_transition.leave.start = classes;
    },
    "leave-end": (classes) => {
      el._x_transition.leave.end = classes;
    }
  };
  directiveStorageMap[stage](classString);
}
function registerTransitionsFromHelper(el, modifiers, stage) {
  registerTransitionObject(el, setStyles);
  let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
  let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
  let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
  if (modifiers.includes("in") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
  }
  if (modifiers.includes("out") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
  }
  let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
  let wantsOpacity = wantsAll || modifiers.includes("opacity");
  let wantsScale = wantsAll || modifiers.includes("scale");
  let opacityValue = wantsOpacity ? 0 : 1;
  let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
  let delay = modifierValue(modifiers, "delay", 0) / 1e3;
  let origin = modifierValue(modifiers, "origin", "center");
  let property = "opacity, transform";
  let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
  let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
  let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
  if (transitioningIn) {
    el._x_transition.enter.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationIn}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.enter.start = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
    el._x_transition.enter.end = {
      opacity: 1,
      transform: `scale(1)`
    };
  }
  if (transitioningOut) {
    el._x_transition.leave.during = {
      transformOrigin: origin,
      transitionDelay: `${delay}s`,
      transitionProperty: property,
      transitionDuration: `${durationOut}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.leave.start = {
      opacity: 1,
      transform: `scale(1)`
    };
    el._x_transition.leave.end = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
  }
}
function registerTransitionObject(el, setFunction, defaultValue = {}) {
  if (!el._x_transition)
    el._x_transition = {
      enter: { during: defaultValue, start: defaultValue, end: defaultValue },
      leave: { during: defaultValue, start: defaultValue, end: defaultValue },
      in(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.enter.during,
          start: this.enter.start,
          end: this.enter.end
        }, before, after);
      },
      out(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.leave.during,
          start: this.leave.start,
          end: this.leave.end
        }, before, after);
      }
    };
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
  const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let clickAwayCompatibleShow = () => nextTick2(show);
  if (value) {
    if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
      el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
    } else {
      el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
    }
    return;
  }
  el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
    el._x_transition.out(() => {
    }, () => resolve(hide));
    el._x_transitioning && el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
  }) : Promise.resolve(hide);
  queueMicrotask(() => {
    let closest = closestHide(el);
    if (closest) {
      if (!closest._x_hideChildren)
        closest._x_hideChildren = [];
      closest._x_hideChildren.push(el);
    } else {
      nextTick2(() => {
        let hideAfterChildren = (el2) => {
          let carry = Promise.all([
            el2._x_hidePromise,
            ...(el2._x_hideChildren || []).map(hideAfterChildren)
          ]).then(([i]) => i?.());
          delete el2._x_hidePromise;
          delete el2._x_hideChildren;
          return carry;
        };
        hideAfterChildren(el).catch((e) => {
          if (!e.isFromCancelledTransition)
            throw e;
        });
      });
    }
  });
};
function closestHide(el) {
  let parent = el.parentNode;
  if (!parent)
    return;
  return parent._x_hidePromise ? parent : closestHide(parent);
}
function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {
}, after = () => {
}) {
  if (el._x_transitioning)
    el._x_transitioning.cancel();
  if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
    before();
    after();
    return;
  }
  let undoStart, undoDuring, undoEnd;
  performTransition(el, {
    start() {
      undoStart = setFunction(el, start2);
    },
    during() {
      undoDuring = setFunction(el, during);
    },
    before,
    end() {
      undoStart();
      undoEnd = setFunction(el, end);
    },
    after,
    cleanup() {
      undoDuring();
      undoEnd();
    }
  });
}
function performTransition(el, stages) {
  let interrupted, reachedBefore, reachedEnd;
  let finish = once(() => {
    mutateDom(() => {
      interrupted = true;
      if (!reachedBefore)
        stages.before();
      if (!reachedEnd) {
        stages.end();
        releaseNextTicks();
      }
      stages.after();
      if (el.isConnected)
        stages.cleanup();
      delete el._x_transitioning;
    });
  });
  el._x_transitioning = {
    beforeCancels: [],
    beforeCancel(callback) {
      this.beforeCancels.push(callback);
    },
    cancel: once(function() {
      while (this.beforeCancels.length) {
        this.beforeCancels.shift()();
      }
      ;
      finish();
    }),
    finish
  };
  mutateDom(() => {
    stages.start();
    stages.during();
  });
  holdNextTicks();
  requestAnimationFrame(() => {
    if (interrupted)
      return;
    let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
    let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    if (duration === 0)
      duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
    mutateDom(() => {
      stages.before();
    });
    reachedBefore = true;
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      mutateDom(() => {
        stages.end();
      });
      releaseNextTicks();
      setTimeout(el._x_transitioning.finish, duration + delay);
      reachedEnd = true;
    });
  });
}
function modifierValue(modifiers, key, fallback) {
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "scale") {
    if (isNaN(rawValue))
      return fallback;
  }
  if (key === "duration" || key === "delay") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "origin") {
    if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
      return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
    }
  }
  return rawValue;
}

// packages/alpinejs/src/clone.js
var isCloning = false;
function skipDuringClone(callback, fallback = () => {
}) {
  return (...args) => isCloning ? fallback(...args) : callback(...args);
}
function onlyDuringClone(callback) {
  return (...args) => isCloning && callback(...args);
}
var interceptors = [];
function interceptClone(callback) {
  interceptors.push(callback);
}
function cloneNode(from, to) {
  interceptors.forEach((i) => i(from, to));
  isCloning = true;
  dontRegisterReactiveSideEffects(() => {
    initTree(to, (el, callback) => {
      callback(el, () => {
      });
    });
  });
  isCloning = false;
}
var isCloningLegacy = false;
function clone(oldEl, newEl) {
  if (!newEl._x_dataStack)
    newEl._x_dataStack = oldEl._x_dataStack;
  isCloning = true;
  isCloningLegacy = true;
  dontRegisterReactiveSideEffects(() => {
    cloneTree(newEl);
  });
  isCloning = false;
  isCloningLegacy = false;
}
function cloneTree(el) {
  let hasRunThroughFirstEl = false;
  let shallowWalker = (el2, callback) => {
    walk(el2, (el3, skip) => {
      if (hasRunThroughFirstEl && isRoot(el3))
        return skip();
      hasRunThroughFirstEl = true;
      callback(el3, skip);
    });
  };
  initTree(el, shallowWalker);
}
function dontRegisterReactiveSideEffects(callback) {
  let cache = effect;
  overrideEffect((callback2, el) => {
    let storedEffect = cache(callback2);
    release(storedEffect);
    return () => {
    };
  });
  callback();
  overrideEffect(cache);
}

// packages/alpinejs/src/utils/bind.js
function bind(el, name, value, modifiers = []) {
  if (!el._x_bindings)
    el._x_bindings = reactive({});
  el._x_bindings[name] = value;
  name = modifiers.includes("camel") ? camelCase(name) : name;
  switch (name) {
    case "value":
      bindInputValue(el, value);
      break;
    case "style":
      bindStyles(el, value);
      break;
    case "class":
      bindClasses(el, value);
      break;
    case "selected":
    case "checked":
      bindAttributeAndProperty(el, name, value);
      break;
    default:
      bindAttribute(el, name, value);
      break;
  }
}
function bindInputValue(el, value) {
  if (isRadio(el)) {
    if (el.attributes.value === void 0) {
      el.value = value;
    }
    if (window.fromModel) {
      if (typeof value === "boolean") {
        el.checked = safeParseBoolean(el.value) === value;
      } else {
        el.checked = checkedAttrLooseCompare(el.value, value);
      }
    }
  } else if (isCheckbox(el)) {
    if (Number.isInteger(value)) {
      el.value = value;
    } else if (!Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
      el.value = String(value);
    } else {
      if (Array.isArray(value)) {
        el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
      } else {
        el.checked = !!value;
      }
    }
  } else if (el.tagName === "SELECT") {
    updateSelect(el, value);
  } else {
    if (el.value === value)
      return;
    el.value = value === void 0 ? "" : value;
  }
}
function bindClasses(el, value) {
  if (el._x_undoAddedClasses)
    el._x_undoAddedClasses();
  el._x_undoAddedClasses = setClasses(el, value);
}
function bindStyles(el, value) {
  if (el._x_undoAddedStyles)
    el._x_undoAddedStyles();
  el._x_undoAddedStyles = setStyles(el, value);
}
function bindAttributeAndProperty(el, name, value) {
  bindAttribute(el, name, value);
  setPropertyIfChanged(el, name, value);
}
function bindAttribute(el, name, value) {
  if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
    el.removeAttribute(name);
  } else {
    if (isBooleanAttr(name))
      value = name;
    setIfChanged(el, name, value);
  }
}
function setIfChanged(el, attrName, value) {
  if (el.getAttribute(attrName) != value) {
    el.setAttribute(attrName, value);
  }
}
function setPropertyIfChanged(el, propName, value) {
  if (el[propName] !== value) {
    el[propName] = value;
  }
}
function updateSelect(el, value) {
  const arrayWrappedValue = [].concat(value).map((value2) => {
    return value2 + "";
  });
  Array.from(el.options).forEach((option) => {
    option.selected = arrayWrappedValue.includes(option.value);
  });
}
function camelCase(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function checkedAttrLooseCompare(valueA, valueB) {
  return valueA == valueB;
}
function safeParseBoolean(rawValue) {
  if ([1, "1", "true", "on", "yes", true].includes(rawValue)) {
    return true;
  }
  if ([0, "0", "false", "off", "no", false].includes(rawValue)) {
    return false;
  }
  return rawValue ? Boolean(rawValue) : null;
}
var booleanAttributes = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootdelegatesfocus",
  "shadowrootserializable"
]);
function isBooleanAttr(attrName) {
  return booleanAttributes.has(attrName);
}
function attributeShouldntBePreservedIfFalsy(name) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
}
function getBinding(el, name, fallback) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  return getAttributeBinding(el, name, fallback);
}
function extractProp(el, name, fallback, extract = true) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  if (el._x_inlineBindings && el._x_inlineBindings[name] !== void 0) {
    let binding = el._x_inlineBindings[name];
    binding.extract = extract;
    return dontAutoEvaluateFunctions(() => {
      return evaluate(el, binding.expression);
    });
  }
  return getAttributeBinding(el, name, fallback);
}
function getAttributeBinding(el, name, fallback) {
  let attr = el.getAttribute(name);
  if (attr === null)
    return typeof fallback === "function" ? fallback() : fallback;
  if (attr === "")
    return true;
  if (isBooleanAttr(name)) {
    return !![name, "true"].includes(attr);
  }
  return attr;
}
function isCheckbox(el) {
  return el.type === "checkbox" || el.localName === "ui-checkbox" || el.localName === "ui-switch";
}
function isRadio(el) {
  return el.type === "radio" || el.localName === "ui-radio";
}

// packages/alpinejs/src/utils/debounce.js
function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// packages/alpinejs/src/utils/throttle.js
function throttle(func, limit) {
  let inThrottle;
  return function() {
    let context = this, args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// packages/alpinejs/src/entangle.js
function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
  let firstRun = true;
  let outerHash;
  let innerHash;
  let reference = effect(() => {
    let outer = outerGet();
    let inner = innerGet();
    if (firstRun) {
      innerSet(cloneIfObject(outer));
      firstRun = false;
    } else {
      let outerHashLatest = JSON.stringify(outer);
      let innerHashLatest = JSON.stringify(inner);
      if (outerHashLatest !== outerHash) {
        innerSet(cloneIfObject(outer));
      } else if (outerHashLatest !== innerHashLatest) {
        outerSet(cloneIfObject(inner));
      } else {
      }
    }
    outerHash = JSON.stringify(outerGet());
    innerHash = JSON.stringify(innerGet());
  });
  return () => {
    release(reference);
  };
}
function cloneIfObject(value) {
  return typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
}

// packages/alpinejs/src/plugin.js
function plugin(callback) {
  let callbacks = Array.isArray(callback) ? callback : [callback];
  callbacks.forEach((i) => i(alpine_default));
}

// packages/alpinejs/src/store.js
var stores = {};
var isReactive = false;
function store(name, value) {
  if (!isReactive) {
    stores = reactive(stores);
    isReactive = true;
  }
  if (value === void 0) {
    return stores[name];
  }
  stores[name] = value;
  initInterceptors(stores[name]);
  if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
    stores[name].init();
  }
}
function getStores() {
  return stores;
}

// packages/alpinejs/src/binds.js
var binds = {};
function bind2(name, bindings) {
  let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
  if (name instanceof Element) {
    return applyBindingsObject(name, getBindings());
  } else {
    binds[name] = getBindings;
  }
  return () => {
  };
}
function injectBindingProviders(obj) {
  Object.entries(binds).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback(...args);
        };
      }
    });
  });
  return obj;
}
function applyBindingsObject(el, obj, original) {
  let cleanupRunners = [];
  while (cleanupRunners.length)
    cleanupRunners.pop()();
  let attributes = Object.entries(obj).map(([name, value]) => ({ name, value }));
  let staticAttributes = attributesOnly(attributes);
  attributes = attributes.map((attribute) => {
    if (staticAttributes.find((attr) => attr.name === attribute.name)) {
      return {
        name: `x-bind:${attribute.name}`,
        value: `"${attribute.value}"`
      };
    }
    return attribute;
  });
  directives(el, attributes, original).map((handle) => {
    cleanupRunners.push(handle.runCleanups);
    handle();
  });
  return () => {
    while (cleanupRunners.length)
      cleanupRunners.pop()();
  };
}

// packages/alpinejs/src/datas.js
var datas = {};
function data(name, callback) {
  datas[name] = callback;
}
function injectDataProviders(obj, context) {
  Object.entries(datas).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback.bind(context)(...args);
        };
      },
      enumerable: false
    });
  });
  return obj;
}

// packages/alpinejs/src/alpine.js
var Alpine = {
  get reactive() {
    return reactive;
  },
  get release() {
    return release;
  },
  get effect() {
    return effect;
  },
  get raw() {
    return raw;
  },
  version: "3.14.8",
  flushAndStopDeferringMutations,
  dontAutoEvaluateFunctions,
  disableEffectScheduling,
  startObservingMutations,
  stopObservingMutations,
  setReactivityEngine,
  onAttributeRemoved,
  onAttributesAdded,
  closestDataStack,
  skipDuringClone,
  onlyDuringClone,
  addRootSelector,
  addInitSelector,
  interceptClone,
  addScopeToNode,
  deferMutations,
  mapAttributes,
  evaluateLater,
  interceptInit,
  setEvaluator,
  mergeProxies,
  extractProp,
  findClosest,
  onElRemoved,
  closestRoot,
  destroyTree,
  interceptor,
  // INTERNAL: not public API and is subject to change without major release.
  transition,
  // INTERNAL
  setStyles,
  // INTERNAL
  mutateDom,
  directive,
  entangle,
  throttle,
  debounce,
  evaluate,
  initTree,
  nextTick,
  prefixed: prefix,
  prefix: setPrefix,
  plugin,
  magic,
  store,
  start,
  clone,
  // INTERNAL
  cloneNode,
  // INTERNAL
  bound: getBinding,
  $data: scope,
  watch,
  walk,
  data,
  bind: bind2
};
var alpine_default = Alpine;

// node_modules/@vue/shared/dist/shared.esm-bundler.js
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
var EMPTY_OBJ =  true ? Object.freeze({}) : 0;
var EMPTY_ARR =  true ? Object.freeze([]) : 0;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
var camelizeRE = /-(\w)/g;
var camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);

// node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var targetMap = /* @__PURE__ */ new WeakMap();
var effectStack = [];
var activeEffect;
var ITERATE_KEY = Symbol( true ? "iterate" : 0);
var MAP_KEY_ITERATE_KEY = Symbol( true ? "Map key iterate" : 0);
function isEffect(fn) {
  return fn && fn._isEffect === true;
}
function effect2(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    fn = fn.raw;
  }
  const effect3 = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect3();
  }
  return effect3;
}
function stop(effect3) {
  if (effect3.active) {
    cleanup(effect3);
    if (effect3.options.onStop) {
      effect3.options.onStop();
    }
    effect3.active = false;
  }
}
var uid = 0;
function createReactiveEffect(fn, options) {
  const effect3 = function reactiveEffect() {
    if (!effect3.active) {
      return fn();
    }
    if (!effectStack.includes(effect3)) {
      cleanup(effect3);
      try {
        enableTracking();
        effectStack.push(effect3);
        activeEffect = effect3;
        return fn();
      } finally {
        effectStack.pop();
        resetTracking();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect3.id = uid++;
  effect3.allowRecurse = !!options.allowRecurse;
  effect3._isEffect = true;
  effect3.active = true;
  effect3.raw = fn;
  effect3.deps = [];
  effect3.options = options;
  return effect3;
}
function cleanup(effect3) {
  const { deps } = effect3;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect3);
    }
    deps.length = 0;
  }
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (!shouldTrack || activeEffect === void 0) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = /* @__PURE__ */ new Set());
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if (activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      });
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = /* @__PURE__ */ new Set();
  const add2 = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect3) => {
        if (effect3 !== activeEffect || effect3.allowRecurse) {
          effects.add(effect3);
        }
      });
    }
  };
  if (type === "clear") {
    depsMap.forEach(add2);
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        add2(dep);
      }
    });
  } else {
    if (key !== void 0) {
      add2(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          add2(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          add2(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const run = (effect3) => {
    if (effect3.options.onTrigger) {
      effect3.options.onTrigger({
        effect: effect3,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      });
    }
    if (effect3.options.scheduler) {
      effect3.options.scheduler(effect3);
    } else {
      effect3();
    }
  };
  effects.forEach(run);
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
var get2 = /* @__PURE__ */ createGetter();
var readonlyGet = /* @__PURE__ */ createGetter(true);
var arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly = false, shallow = false) {
  return function get3(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive2(res);
    }
    return res;
  };
}
var set2 = /* @__PURE__ */ createSetter();
function createSetter(shallow = false) {
  return function set3(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
var mutableHandlers = {
  get: get2,
  set: set2,
  deleteProperty,
  has,
  ownKeys
};
var readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    if (true) {
      console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  },
  deleteProperty(target, key) {
    if (true) {
      console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  }
};
var toReactive = (value) => isObject(value) ? reactive2(value) : value;
var toReadonly = (value) => isObject(value) ? readonly(value) : value;
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
  target = target[
    "__v_raw"
    /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "get", key);
  }
  !isReadonly && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly = false) {
  const target = this[
    "__v_raw"
    /* RAW */
  ];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "has", key);
  }
  !isReadonly && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
  target = target[
    "__v_raw"
    /* RAW */
  ];
  !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get3 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3 ? get3.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget =  true ? isMap(target) ? new Map(target) : new Set(target) : 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly, isShallow) {
  return function(...args) {
    const target = this[
      "__v_raw"
      /* RAW */
    ];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    if (true) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
    }
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* CLEAR */
    ),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod(
      "add"
      /* ADD */
    ),
    set: createReadonlyMethod(
      "set"
      /* SET */
    ),
    delete: createReadonlyMethod(
      "delete"
      /* DELETE */
    ),
    clear: createReadonlyMethod(
      "clear"
      /* CLEAR */
    ),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
var [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
var mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
var readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value[
    "__v_skip"
    /* SKIP */
  ] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive2(target) {
  if (target && target[
    "__v_isReadonly"
    /* IS_READONLY */
  ]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    if (true) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target[
    "__v_raw"
    /* RAW */
  ] && !(isReadonly && target[
    "__v_isReactive"
    /* IS_REACTIVE */
  ])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function toRaw(observed) {
  return observed && toRaw(observed[
    "__v_raw"
    /* RAW */
  ]) || observed;
}
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}

// packages/alpinejs/src/magics/$nextTick.js
magic("nextTick", () => nextTick);

// packages/alpinejs/src/magics/$dispatch.js
magic("dispatch", (el) => dispatch.bind(dispatch, el));

// packages/alpinejs/src/magics/$watch.js
magic("watch", (el, { evaluateLater: evaluateLater2, cleanup: cleanup2 }) => (key, callback) => {
  let evaluate2 = evaluateLater2(key);
  let getter = () => {
    let value;
    evaluate2((i) => value = i);
    return value;
  };
  let unwatch = watch(getter, callback);
  cleanup2(unwatch);
});

// packages/alpinejs/src/magics/$store.js
magic("store", getStores);

// packages/alpinejs/src/magics/$data.js
magic("data", (el) => scope(el));

// packages/alpinejs/src/magics/$root.js
magic("root", (el) => closestRoot(el));

// packages/alpinejs/src/magics/$refs.js
magic("refs", (el) => {
  if (el._x_refs_proxy)
    return el._x_refs_proxy;
  el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
  return el._x_refs_proxy;
});
function getArrayOfRefObject(el) {
  let refObjects = [];
  findClosest(el, (i) => {
    if (i._x_refs)
      refObjects.push(i._x_refs);
  });
  return refObjects;
}

// packages/alpinejs/src/ids.js
var globalIdMemo = {};
function findAndIncrementId(name) {
  if (!globalIdMemo[name])
    globalIdMemo[name] = 0;
  return ++globalIdMemo[name];
}
function closestIdRoot(el, name) {
  return findClosest(el, (element) => {
    if (element._x_ids && element._x_ids[name])
      return true;
  });
}
function setIdRoot(el, name) {
  if (!el._x_ids)
    el._x_ids = {};
  if (!el._x_ids[name])
    el._x_ids[name] = findAndIncrementId(name);
}

// packages/alpinejs/src/magics/$id.js
magic("id", (el, { cleanup: cleanup2 }) => (name, key = null) => {
  let cacheKey = `${name}${key ? `-${key}` : ""}`;
  return cacheIdByNameOnElement(el, cacheKey, cleanup2, () => {
    let root = closestIdRoot(el, name);
    let id = root ? root._x_ids[name] : findAndIncrementId(name);
    return key ? `${name}-${id}-${key}` : `${name}-${id}`;
  });
});
interceptClone((from, to) => {
  if (from._x_id) {
    to._x_id = from._x_id;
  }
});
function cacheIdByNameOnElement(el, cacheKey, cleanup2, callback) {
  if (!el._x_id)
    el._x_id = {};
  if (el._x_id[cacheKey])
    return el._x_id[cacheKey];
  let output = callback();
  el._x_id[cacheKey] = output;
  cleanup2(() => {
    delete el._x_id[cacheKey];
  });
  return output;
}

// packages/alpinejs/src/magics/$el.js
magic("el", (el) => el);

// packages/alpinejs/src/magics/index.js
warnMissingPluginMagic("Focus", "focus", "focus");
warnMissingPluginMagic("Persist", "persist", "persist");
function warnMissingPluginMagic(name, magicName, slug) {
  magic(magicName, (el) => warn(`You can't use [$${magicName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/directives/x-modelable.js
directive("modelable", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2, cleanup: cleanup2 }) => {
  let func = evaluateLater2(expression);
  let innerGet = () => {
    let result;
    func((i) => result = i);
    return result;
  };
  let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
  let innerSet = (val) => evaluateInnerSet(() => {
  }, { scope: { "__placeholder": val } });
  let initialValue = innerGet();
  innerSet(initialValue);
  queueMicrotask(() => {
    if (!el._x_model)
      return;
    el._x_removeModelListeners["default"]();
    let outerGet = el._x_model.get;
    let outerSet = el._x_model.set;
    let releaseEntanglement = entangle(
      {
        get() {
          return outerGet();
        },
        set(value) {
          outerSet(value);
        }
      },
      {
        get() {
          return innerGet();
        },
        set(value) {
          innerSet(value);
        }
      }
    );
    cleanup2(releaseEntanglement);
  });
});

// packages/alpinejs/src/directives/x-teleport.js
directive("teleport", (el, { modifiers, expression }, { cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-teleport can only be used on a <template> tag", el);
  let target = getTarget(expression);
  let clone2 = el.content.cloneNode(true).firstElementChild;
  el._x_teleport = clone2;
  clone2._x_teleportBack = el;
  el.setAttribute("data-teleport-template", true);
  clone2.setAttribute("data-teleport-target", true);
  if (el._x_forwardEvents) {
    el._x_forwardEvents.forEach((eventName) => {
      clone2.addEventListener(eventName, (e) => {
        e.stopPropagation();
        el.dispatchEvent(new e.constructor(e.type, e));
      });
    });
  }
  addScopeToNode(clone2, {}, el);
  let placeInDom = (clone3, target2, modifiers2) => {
    if (modifiers2.includes("prepend")) {
      target2.parentNode.insertBefore(clone3, target2);
    } else if (modifiers2.includes("append")) {
      target2.parentNode.insertBefore(clone3, target2.nextSibling);
    } else {
      target2.appendChild(clone3);
    }
  };
  mutateDom(() => {
    placeInDom(clone2, target, modifiers);
    skipDuringClone(() => {
      initTree(clone2);
    })();
  });
  el._x_teleportPutBack = () => {
    let target2 = getTarget(expression);
    mutateDom(() => {
      placeInDom(el._x_teleport, target2, modifiers);
    });
  };
  cleanup2(
    () => mutateDom(() => {
      clone2.remove();
      destroyTree(clone2);
    })
  );
});
var teleportContainerDuringClone = document.createElement("div");
function getTarget(expression) {
  let target = skipDuringClone(() => {
    return document.querySelector(expression);
  }, () => {
    return teleportContainerDuringClone;
  })();
  if (!target)
    warn(`Cannot find x-teleport element for selector: "${expression}"`);
  return target;
}

// packages/alpinejs/src/directives/x-ignore.js
var handler = () => {
};
handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
  modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
  cleanup2(() => {
    modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
  });
};
directive("ignore", handler);

// packages/alpinejs/src/directives/x-effect.js
directive("effect", skipDuringClone((el, { expression }, { effect: effect3 }) => {
  effect3(evaluateLater(el, expression));
}));

// packages/alpinejs/src/utils/on.js
function on(el, event, modifiers, callback) {
  let listenerTarget = el;
  let handler4 = (e) => callback(e);
  let options = {};
  let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
  if (modifiers.includes("dot"))
    event = dotSyntax(event);
  if (modifiers.includes("camel"))
    event = camelCase2(event);
  if (modifiers.includes("passive"))
    options.passive = true;
  if (modifiers.includes("capture"))
    options.capture = true;
  if (modifiers.includes("window"))
    listenerTarget = window;
  if (modifiers.includes("document"))
    listenerTarget = document;
  if (modifiers.includes("debounce")) {
    let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = debounce(handler4, wait);
  }
  if (modifiers.includes("throttle")) {
    let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler4 = throttle(handler4, wait);
  }
  if (modifiers.includes("prevent"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.preventDefault();
      next(e);
    });
  if (modifiers.includes("stop"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.stopPropagation();
      next(e);
    });
  if (modifiers.includes("once")) {
    handler4 = wrapHandler(handler4, (next, e) => {
      next(e);
      listenerTarget.removeEventListener(event, handler4, options);
    });
  }
  if (modifiers.includes("away") || modifiers.includes("outside")) {
    listenerTarget = document;
    handler4 = wrapHandler(handler4, (next, e) => {
      if (el.contains(e.target))
        return;
      if (e.target.isConnected === false)
        return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1)
        return;
      if (el._x_isShown === false)
        return;
      next(e);
    });
  }
  if (modifiers.includes("self"))
    handler4 = wrapHandler(handler4, (next, e) => {
      e.target === el && next(e);
    });
  if (isKeyEvent(event) || isClickEvent(event)) {
    handler4 = wrapHandler(handler4, (next, e) => {
      if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
        return;
      }
      next(e);
    });
  }
  listenerTarget.addEventListener(event, handler4, options);
  return () => {
    listenerTarget.removeEventListener(event, handler4, options);
  };
}
function dotSyntax(subject) {
  return subject.replace(/-/g, ".");
}
function camelCase2(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function isNumeric(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function kebabCase2(subject) {
  if ([" ", "_"].includes(
    subject
  ))
    return subject;
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function isKeyEvent(event) {
  return ["keydown", "keyup"].includes(event);
}
function isClickEvent(event) {
  return ["contextmenu", "click", "mouse"].some((i) => event.includes(i));
}
function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
  let keyModifiers = modifiers.filter((i) => {
    return !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive"].includes(i);
  });
  if (keyModifiers.includes("debounce")) {
    let debounceIndex = keyModifiers.indexOf("debounce");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.includes("throttle")) {
    let debounceIndex = keyModifiers.indexOf("throttle");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.length === 0)
    return false;
  if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
    return false;
  const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
  const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
  keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
  if (selectedSystemKeyModifiers.length > 0) {
    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
      if (modifier === "cmd" || modifier === "super")
        modifier = "meta";
      return e[`${modifier}Key`];
    });
    if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
      if (isClickEvent(e.type))
        return false;
      if (keyToModifiers(e.key).includes(keyModifiers[0]))
        return false;
    }
  }
  return true;
}
function keyToModifiers(key) {
  if (!key)
    return [];
  key = kebabCase2(key);
  let modifierToKeyMap = {
    "ctrl": "control",
    "slash": "/",
    "space": " ",
    "spacebar": " ",
    "cmd": "meta",
    "esc": "escape",
    "up": "arrow-up",
    "down": "arrow-down",
    "left": "arrow-left",
    "right": "arrow-right",
    "period": ".",
    "comma": ",",
    "equal": "=",
    "minus": "-",
    "underscore": "_"
  };
  modifierToKeyMap[key] = key;
  return Object.keys(modifierToKeyMap).map((modifier) => {
    if (modifierToKeyMap[modifier] === key)
      return modifier;
  }).filter((modifier) => modifier);
}

// packages/alpinejs/src/directives/x-model.js
directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let scopeTarget = el;
  if (modifiers.includes("parent")) {
    scopeTarget = el.parentNode;
  }
  let evaluateGet = evaluateLater(scopeTarget, expression);
  let evaluateSet;
  if (typeof expression === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression} = __placeholder`);
  } else if (typeof expression === "function" && typeof expression() === "string") {
    evaluateSet = evaluateLater(scopeTarget, `${expression()} = __placeholder`);
  } else {
    evaluateSet = () => {
    };
  }
  let getValue = () => {
    let result;
    evaluateGet((value) => result = value);
    return isGetterSetter(result) ? result.get() : result;
  };
  let setValue = (value) => {
    let result;
    evaluateGet((value2) => result = value2);
    if (isGetterSetter(result)) {
      result.set(value);
    } else {
      evaluateSet(() => {
      }, {
        scope: { "__placeholder": value }
      });
    }
  };
  if (typeof expression === "string" && el.type === "radio") {
    mutateDom(() => {
      if (!el.hasAttribute("name"))
        el.setAttribute("name", expression);
    });
  }
  var event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
  let removeListener = isCloning ? () => {
  } : on(el, event, modifiers, (e) => {
    setValue(getInputValue(el, modifiers, e, getValue()));
  });
  if (modifiers.includes("fill")) {
    if ([void 0, null, ""].includes(getValue()) || isCheckbox(el) && Array.isArray(getValue()) || el.tagName.toLowerCase() === "select" && el.multiple) {
      setValue(
        getInputValue(el, modifiers, { target: el }, getValue())
      );
    }
  }
  if (!el._x_removeModelListeners)
    el._x_removeModelListeners = {};
  el._x_removeModelListeners["default"] = removeListener;
  cleanup2(() => el._x_removeModelListeners["default"]());
  if (el.form) {
    let removeResetListener = on(el.form, "reset", [], (e) => {
      nextTick(() => el._x_model && el._x_model.set(getInputValue(el, modifiers, { target: el }, getValue())));
    });
    cleanup2(() => removeResetListener());
  }
  el._x_model = {
    get() {
      return getValue();
    },
    set(value) {
      setValue(value);
    }
  };
  el._x_forceModelUpdate = (value) => {
    if (value === void 0 && typeof expression === "string" && expression.match(/\./))
      value = "";
    window.fromModel = true;
    mutateDom(() => bind(el, "value", value));
    delete window.fromModel;
  };
  effect3(() => {
    let value = getValue();
    if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
      return;
    el._x_forceModelUpdate(value);
  });
});
function getInputValue(el, modifiers, event, currentValue) {
  return mutateDom(() => {
    if (event instanceof CustomEvent && event.detail !== void 0)
      return event.detail !== null && event.detail !== void 0 ? event.detail : event.target.value;
    else if (isCheckbox(el)) {
      if (Array.isArray(currentValue)) {
        let newValue = null;
        if (modifiers.includes("number")) {
          newValue = safeParseNumber(event.target.value);
        } else if (modifiers.includes("boolean")) {
          newValue = safeParseBoolean(event.target.value);
        } else {
          newValue = event.target.value;
        }
        return event.target.checked ? currentValue.includes(newValue) ? currentValue : currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
      } else {
        return event.target.checked;
      }
    } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
      if (modifiers.includes("number")) {
        return Array.from(event.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        });
      } else if (modifiers.includes("boolean")) {
        return Array.from(event.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseBoolean(rawValue);
        });
      }
      return Array.from(event.target.selectedOptions).map((option) => {
        return option.value || option.text;
      });
    } else {
      let newValue;
      if (isRadio(el)) {
        if (event.target.checked) {
          newValue = event.target.value;
        } else {
          newValue = currentValue;
        }
      } else {
        newValue = event.target.value;
      }
      if (modifiers.includes("number")) {
        return safeParseNumber(newValue);
      } else if (modifiers.includes("boolean")) {
        return safeParseBoolean(newValue);
      } else if (modifiers.includes("trim")) {
        return newValue.trim();
      } else {
        return newValue;
      }
    }
  });
}
function safeParseNumber(rawValue) {
  let number = rawValue ? parseFloat(rawValue) : null;
  return isNumeric2(number) ? number : rawValue;
}
function checkedAttrLooseCompare2(valueA, valueB) {
  return valueA == valueB;
}
function isNumeric2(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function isGetterSetter(value) {
  return value !== null && typeof value === "object" && typeof value.get === "function" && typeof value.set === "function";
}

// packages/alpinejs/src/directives/x-cloak.js
directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));

// packages/alpinejs/src/directives/x-init.js
addInitSelector(() => `[${prefix("init")}]`);
directive("init", skipDuringClone((el, { expression }, { evaluate: evaluate2 }) => {
  if (typeof expression === "string") {
    return !!expression.trim() && evaluate2(expression, {}, false);
  }
  return evaluate2(expression, {}, false);
}));

// packages/alpinejs/src/directives/x-text.js
directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.textContent = value;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-html.js
directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.innerHTML = value;
        el._x_ignoreSelf = true;
        initTree(el);
        delete el._x_ignoreSelf;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-bind.js
mapAttributes(startingWith(":", into(prefix("bind:"))));
var handler2 = (el, { value, modifiers, expression, original }, { effect: effect3, cleanup: cleanup2 }) => {
  if (!value) {
    let bindingProviders = {};
    injectBindingProviders(bindingProviders);
    let getBindings = evaluateLater(el, expression);
    getBindings((bindings) => {
      applyBindingsObject(el, bindings, original);
    }, { scope: bindingProviders });
    return;
  }
  if (value === "key")
    return storeKeyForXFor(el, expression);
  if (el._x_inlineBindings && el._x_inlineBindings[value] && el._x_inlineBindings[value].extract) {
    return;
  }
  let evaluate2 = evaluateLater(el, expression);
  effect3(() => evaluate2((result) => {
    if (result === void 0 && typeof expression === "string" && expression.match(/\./)) {
      result = "";
    }
    mutateDom(() => bind(el, value, result, modifiers));
  }));
  cleanup2(() => {
    el._x_undoAddedClasses && el._x_undoAddedClasses();
    el._x_undoAddedStyles && el._x_undoAddedStyles();
  });
};
handler2.inline = (el, { value, modifiers, expression }) => {
  if (!value)
    return;
  if (!el._x_inlineBindings)
    el._x_inlineBindings = {};
  el._x_inlineBindings[value] = { expression, extract: false };
};
directive("bind", handler2);
function storeKeyForXFor(el, expression) {
  el._x_keyExpression = expression;
}

// packages/alpinejs/src/directives/x-data.js
addRootSelector(() => `[${prefix("data")}]`);
directive("data", (el, { expression }, { cleanup: cleanup2 }) => {
  if (shouldSkipRegisteringDataDuringClone(el))
    return;
  expression = expression === "" ? "{}" : expression;
  let magicContext = {};
  injectMagics(magicContext, el);
  let dataProviderContext = {};
  injectDataProviders(dataProviderContext, magicContext);
  let data2 = evaluate(el, expression, { scope: dataProviderContext });
  if (data2 === void 0 || data2 === true)
    data2 = {};
  injectMagics(data2, el);
  let reactiveData = reactive(data2);
  initInterceptors(reactiveData);
  let undo = addScopeToNode(el, reactiveData);
  reactiveData["init"] && evaluate(el, reactiveData["init"]);
  cleanup2(() => {
    reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
    undo();
  });
});
interceptClone((from, to) => {
  if (from._x_dataStack) {
    to._x_dataStack = from._x_dataStack;
    to.setAttribute("data-has-alpine-state", true);
  }
});
function shouldSkipRegisteringDataDuringClone(el) {
  if (!isCloning)
    return false;
  if (isCloningLegacy)
    return true;
  return el.hasAttribute("data-has-alpine-state");
}

// packages/alpinejs/src/directives/x-show.js
directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
  let evaluate2 = evaluateLater(el, expression);
  if (!el._x_doHide)
    el._x_doHide = () => {
      mutateDom(() => {
        el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
      });
    };
  if (!el._x_doShow)
    el._x_doShow = () => {
      mutateDom(() => {
        if (el.style.length === 1 && el.style.display === "none") {
          el.removeAttribute("style");
        } else {
          el.style.removeProperty("display");
        }
      });
    };
  let hide = () => {
    el._x_doHide();
    el._x_isShown = false;
  };
  let show = () => {
    el._x_doShow();
    el._x_isShown = true;
  };
  let clickAwayCompatibleShow = () => setTimeout(show);
  let toggle = once(
    (value) => value ? show() : hide(),
    (value) => {
      if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
        el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
      } else {
        value ? clickAwayCompatibleShow() : hide();
      }
    }
  );
  let oldValue;
  let firstTime = true;
  effect3(() => evaluate2((value) => {
    if (!firstTime && value === oldValue)
      return;
    if (modifiers.includes("immediate"))
      value ? clickAwayCompatibleShow() : hide();
    toggle(value);
    oldValue = value;
    firstTime = false;
  }));
});

// packages/alpinejs/src/directives/x-for.js
directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  let iteratorNames = parseForExpression(expression);
  let evaluateItems = evaluateLater(el, iteratorNames.items);
  let evaluateKey = evaluateLater(
    el,
    // the x-bind:key expression is stored for our use instead of evaluated.
    el._x_keyExpression || "index"
  );
  el._x_prevKeys = [];
  el._x_lookup = {};
  effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
  cleanup2(() => {
    Object.values(el._x_lookup).forEach((el2) => mutateDom(
      () => {
        destroyTree(el2);
        el2.remove();
      }
    ));
    delete el._x_prevKeys;
    delete el._x_lookup;
  });
});
function loop(el, iteratorNames, evaluateItems, evaluateKey) {
  let isObject2 = (i) => typeof i === "object" && !Array.isArray(i);
  let templateEl = el;
  evaluateItems((items) => {
    if (isNumeric3(items) && items >= 0) {
      items = Array.from(Array(items).keys(), (i) => i + 1);
    }
    if (items === void 0)
      items = [];
    let lookup = el._x_lookup;
    let prevKeys = el._x_prevKeys;
    let scopes = [];
    let keys = [];
    if (isObject2(items)) {
      items = Object.entries(items).map(([key, value]) => {
        let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
        evaluateKey((value2) => {
          if (keys.includes(value2))
            warn("Duplicate key on x-for", el);
          keys.push(value2);
        }, { scope: { index: key, ...scope2 } });
        scopes.push(scope2);
      });
    } else {
      for (let i = 0; i < items.length; i++) {
        let scope2 = getIterationScopeVariables(iteratorNames, items[i], i, items);
        evaluateKey((value) => {
          if (keys.includes(value))
            warn("Duplicate key on x-for", el);
          keys.push(value);
        }, { scope: { index: i, ...scope2 } });
        scopes.push(scope2);
      }
    }
    let adds = [];
    let moves = [];
    let removes = [];
    let sames = [];
    for (let i = 0; i < prevKeys.length; i++) {
      let key = prevKeys[i];
      if (keys.indexOf(key) === -1)
        removes.push(key);
    }
    prevKeys = prevKeys.filter((key) => !removes.includes(key));
    let lastKey = "template";
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let prevIndex = prevKeys.indexOf(key);
      if (prevIndex === -1) {
        prevKeys.splice(i, 0, key);
        adds.push([lastKey, i]);
      } else if (prevIndex !== i) {
        let keyInSpot = prevKeys.splice(i, 1)[0];
        let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
        prevKeys.splice(i, 0, keyForSpot);
        prevKeys.splice(prevIndex, 0, keyInSpot);
        moves.push([keyInSpot, keyForSpot]);
      } else {
        sames.push(key);
      }
      lastKey = key;
    }
    for (let i = 0; i < removes.length; i++) {
      let key = removes[i];
      if (!(key in lookup))
        continue;
      mutateDom(() => {
        destroyTree(lookup[key]);
        lookup[key].remove();
      });
      delete lookup[key];
    }
    for (let i = 0; i < moves.length; i++) {
      let [keyInSpot, keyForSpot] = moves[i];
      let elInSpot = lookup[keyInSpot];
      let elForSpot = lookup[keyForSpot];
      let marker = document.createElement("div");
      mutateDom(() => {
        if (!elForSpot)
          warn(`x-for ":key" is undefined or invalid`, templateEl, keyForSpot, lookup);
        elForSpot.after(marker);
        elInSpot.after(elForSpot);
        elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
        marker.before(elInSpot);
        elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
        marker.remove();
      });
      elForSpot._x_refreshXForScope(scopes[keys.indexOf(keyForSpot)]);
    }
    for (let i = 0; i < adds.length; i++) {
      let [lastKey2, index] = adds[i];
      let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
      if (lastEl._x_currentIfEl)
        lastEl = lastEl._x_currentIfEl;
      let scope2 = scopes[index];
      let key = keys[index];
      let clone2 = document.importNode(templateEl.content, true).firstElementChild;
      let reactiveScope = reactive(scope2);
      addScopeToNode(clone2, reactiveScope, templateEl);
      clone2._x_refreshXForScope = (newScope) => {
        Object.entries(newScope).forEach(([key2, value]) => {
          reactiveScope[key2] = value;
        });
      };
      mutateDom(() => {
        lastEl.after(clone2);
        skipDuringClone(() => initTree(clone2))();
      });
      if (typeof key === "object") {
        warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
      }
      lookup[key] = clone2;
    }
    for (let i = 0; i < sames.length; i++) {
      lookup[sames[i]]._x_refreshXForScope(scopes[keys.indexOf(sames[i])]);
    }
    templateEl._x_prevKeys = keys;
  });
}
function parseForExpression(expression) {
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  let stripParensRE = /^\s*\(|\)\s*$/g;
  let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  let inMatch = expression.match(forAliasRE);
  if (!inMatch)
    return;
  let res = {};
  res.items = inMatch[2].trim();
  let item = inMatch[1].replace(stripParensRE, "").trim();
  let iteratorMatch = item.match(forIteratorRE);
  if (iteratorMatch) {
    res.item = item.replace(forIteratorRE, "").trim();
    res.index = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.collection = iteratorMatch[2].trim();
    }
  } else {
    res.item = item;
  }
  return res;
}
function getIterationScopeVariables(iteratorNames, item, index, items) {
  let scopeVariables = {};
  if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
    let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
    names.forEach((name, i) => {
      scopeVariables[name] = item[i];
    });
  } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
    let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
    names.forEach((name) => {
      scopeVariables[name] = item[name];
    });
  } else {
    scopeVariables[iteratorNames.item] = item;
  }
  if (iteratorNames.index)
    scopeVariables[iteratorNames.index] = index;
  if (iteratorNames.collection)
    scopeVariables[iteratorNames.collection] = items;
  return scopeVariables;
}
function isNumeric3(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}

// packages/alpinejs/src/directives/x-ref.js
function handler3() {
}
handler3.inline = (el, { expression }, { cleanup: cleanup2 }) => {
  let root = closestRoot(el);
  if (!root._x_refs)
    root._x_refs = {};
  root._x_refs[expression] = el;
  cleanup2(() => delete root._x_refs[expression]);
};
directive("ref", handler3);

// packages/alpinejs/src/directives/x-if.js
directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-if can only be used on a <template> tag", el);
  let evaluate2 = evaluateLater(el, expression);
  let show = () => {
    if (el._x_currentIfEl)
      return el._x_currentIfEl;
    let clone2 = el.content.cloneNode(true).firstElementChild;
    addScopeToNode(clone2, {}, el);
    mutateDom(() => {
      el.after(clone2);
      skipDuringClone(() => initTree(clone2))();
    });
    el._x_currentIfEl = clone2;
    el._x_undoIf = () => {
      mutateDom(() => {
        destroyTree(clone2);
        clone2.remove();
      });
      delete el._x_currentIfEl;
    };
    return clone2;
  };
  let hide = () => {
    if (!el._x_undoIf)
      return;
    el._x_undoIf();
    delete el._x_undoIf;
  };
  effect3(() => evaluate2((value) => {
    value ? show() : hide();
  }));
  cleanup2(() => el._x_undoIf && el._x_undoIf());
});

// packages/alpinejs/src/directives/x-id.js
directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
  let names = evaluate2(expression);
  names.forEach((name) => setIdRoot(el, name));
});
interceptClone((from, to) => {
  if (from._x_ids) {
    to._x_ids = from._x_ids;
  }
});

// packages/alpinejs/src/directives/x-on.js
mapAttributes(startingWith("@", into(prefix("on:"))));
directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
  let evaluate2 = expression ? evaluateLater(el, expression) : () => {
  };
  if (el.tagName.toLowerCase() === "template") {
    if (!el._x_forwardEvents)
      el._x_forwardEvents = [];
    if (!el._x_forwardEvents.includes(value))
      el._x_forwardEvents.push(value);
  }
  let removeListener = on(el, value, modifiers, (e) => {
    evaluate2(() => {
    }, { scope: { "$event": e }, params: [e] });
  });
  cleanup2(() => removeListener());
}));

// packages/alpinejs/src/directives/index.js
warnMissingPluginDirective("Collapse", "collapse", "collapse");
warnMissingPluginDirective("Intersect", "intersect", "intersect");
warnMissingPluginDirective("Focus", "trap", "focus");
warnMissingPluginDirective("Mask", "mask", "mask");
function warnMissingPluginDirective(name, directiveName, slug) {
  directive(directiveName, (el) => warn(`You can't use [x-${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/index.js
alpine_default.setEvaluator(normalEvaluator);
alpine_default.setReactivityEngine({ reactive: reactive2, effect: effect2, release: stop, raw: toRaw });
var src_default = alpine_default;

// packages/alpinejs/builds/module.js
var module_default = src_default;



/***/ }),

/***/ "./src/scripts/auth/Reset-password.js":
/*!********************************************!*\
  !*** ./src/scripts/auth/Reset-password.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tools_Submit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/Submit */ "./src/scripts/tools/Submit.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  form: document.getElementById('reset-password'),
  submitButtonText: 'Reset password',
  submitButtonLoadingText: 'Resetting password...',
  submitButtonSuccessText: 'Password reset successfully!',
  init() {
    if (!this.form) return;
    this.submitButton = this.form.querySelector('button[type=submit]');
    this.message = this.form.querySelector('.message');
    this.form.addEventListener('submit', _tools_Submit__WEBPACK_IMPORTED_MODULE_1__["default"].bind(this));
  },
  validateForm(data) {
    const errors = [];
    const password = data.get('password');
    const confirmPassword = data.get('confirm-password');
    if (!password || !this.isSecurePassword(password)) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Password must be at least 8 characters long, contain one uppercase letter, and one special character.'));
    }
    if (password !== confirmPassword) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Passwords do not match.'));
    }
    const key = data.get('key');
    const email = data.get('email');
    if (!key || !email) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Invalid reset link.'));
    }
    return errors;
  },
  isSecurePassword(password) {
    const pattern = /^(?=.*[A-Z])(?=.*[\W])(?=.*[a-zA-Z0-9]).{8,}$/;
    return pattern.test(password);
  },
  async process_submit(formData) {
    const data = new URLSearchParams();
    formData.forEach((value, key) => {
      data.append(key, value);
    });
    data.append('action', 'reset_password');
    const response = await fetch(App.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString()
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
});

/***/ }),

/***/ "./src/scripts/auth/Sign-in.js":
/*!*************************************!*\
  !*** ./src/scripts/auth/Sign-in.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var validator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! validator */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/index.js");
/* harmony import */ var validator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(validator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tools_Submit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/Submit */ "./src/scripts/tools/Submit.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  form: document.getElementById('sign-in'),
  submitButtonText: 'Sign in',
  submitButtonLoadingText: 'Signing in...',
  submitButtonSuccessText: 'Opening your dashboard...',
  init() {
    if (!this.form) return;
    this.submitButton = this.form.querySelector('button[type=submit]');
    this.message = this.form.querySelector('.message');
    this.form.addEventListener('submit', _tools_Submit__WEBPACK_IMPORTED_MODULE_1__["default"].bind(this));
  },
  validateForm(data) {
    const errors = [];
    const email = data.get('email');
    if (!email || !validator__WEBPACK_IMPORTED_MODULE_2___default().isEmail(email)) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Invalid email address'));
    }
    const password = data.get('password');
    if (!password) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Please write your password'));
    }
    return errors;
  },
  async process_submit(formData) {
    const data = new URLSearchParams();
    formData.forEach((value, key) => {
      data.append(key, value);
    });
    data.append('action', 'sign_in');
    const response = await fetch(App.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString()
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }
});

/***/ }),

/***/ "./src/scripts/auth/Sign-up.js":
/*!*************************************!*\
  !*** ./src/scripts/auth/Sign-up.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var validator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! validator */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/index.js");
/* harmony import */ var validator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(validator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tools_Submit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/Submit */ "./src/scripts/tools/Submit.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  form: document.getElementById('sign-up'),
  submitButtonText: 'Sign up',
  submitButtonLoadingText: 'Signing up...',
  submitButtonSuccessText: 'Check your email...',
  init() {
    if (!this.form) return;
    this.submitButton = this.form.querySelector('button[type=submit]');
    this.message = this.form.querySelector('.message');
    this.form.addEventListener('submit', _tools_Submit__WEBPACK_IMPORTED_MODULE_1__["default"].bind(this));
  },
  validateForm(data) {
    const errors = [];
    const email = data.get('email');
    if (!email || !validator__WEBPACK_IMPORTED_MODULE_2___default().isEmail(email)) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Invalid email address'));
    }
    return errors;
  },
  async process_submit(formData) {
    const data = new URLSearchParams();
    formData.forEach((value, key) => {
      data.append(key, value);
    });
    data.append('action', 'sign_up');
    const response = await fetch(App.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString()
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
  hide_form() {
    this.form.querySelectorAll('div:not(.message)').forEach(div => div.remove());
  }
});

/***/ }),

/***/ "./src/scripts/site/Create.js":
/*!************************************!*\
  !*** ./src/scripts/site/Create.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tools_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/Utils */ "./src/scripts/tools/Utils.js");
/* harmony import */ var _tools_Submit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tools/Submit */ "./src/scripts/tools/Submit.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  form: document.getElementById('create-space'),
  company_name: document.getElementById('company_name'),
  space_name: document.getElementById('space_name'),
  submitButtonText: 'Create my Space',
  submitButtonLoadingText: 'Creating your Space...',
  submitButtonSuccessText: 'Space created. Redirecting...',
  timer: null,
  init() {
    if (!this.form) return;
    this.submitButton = this.form.querySelector('button[type=submit]');
    this.message = this.form.querySelector('.message');
    this.form.addEventListener('submit', _tools_Submit__WEBPACK_IMPORTED_MODULE_2__["default"].bind(this));
    this.space_name.addEventListener('blur', this.check_site_name_exists.bind(this));
    this.company_name.addEventListener('input', this.mask_space_name.bind(this));
    this.space_name.addEventListener('input', this.mask_space_name.bind(this));
    this.company_name.addEventListener('blur', this.check_site_name_exists.bind(this));
  },
  validateForm(data) {
    const errors = [];
    const company_name = data.get('company_name');
    const space_name = data.get('space_name');
    if (!company_name || company_name.trim().length === 0) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Your company name is required.'));
    }
    if (!space_name) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The space name is required'));
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(space_name)) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The space name should be URL friendly. <em>No spaces, no special characters</em>.'));
    }
    if (space_name.trim().length > 16) {
      errors.push((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The space name should be 16 characters maximum.'));
    }
    return errors;
  },
  async check_site_name_exists(event) {
    const data = new URLSearchParams();
    const space_name = document.getElementById('space_name').value;
    if (!space_name) {
      _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].displayMessage(this.message, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The space name is required.'), 'error');
      return;
    }
    data.append('action', 'check_space_name_exists');
    data.append('space_name', this.space_name.value);
    _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].hideMessage(this.message);
    _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].toggleButton(this.submitButton, true, 'Checking if your URL is available...', 'white');
    const response = await fetch(App.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString()
    });
    if (!response.ok) {
      _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].toggleButton(this.submitButton, false, this.submitButtonText);
      throw new Error('Network response was not ok.');
    }
    const datum = await response.json();
    if (datum?.data?.exists) {
      _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].displayMessage(this.message, datum?.data?.message, 'error');
      _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].toggleButton(this.submitButton, true, 'Fix the site name to create your Space.');
    } else {
      _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].toggleButton(this.submitButton, false, this.submitButtonText);
    }
  },
  mask_space_name() {
    const element = this.space_name;
    const value = element.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    element.value = value;
    document.getElementById('space_url_view').innerText = value;
  },
  async process_submit(formData) {
    const data = new URLSearchParams();
    formData.forEach((value, key) => {
      data.append(key, value);
    });
    const install_key = localStorage.getItem('install_key');
    if (install_key) {
      data.append('install_key', install_key);
    }
    data.append('action', 'create_space');
    const response = await fetch(App.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data.toString()
    });
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  },
  poll_check_finished_install(callback_data) {
    _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].toggleButton(this.submitButton, true, this.submitButtonLoadingText, 'white');
    _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].disableFields(this.form);
    const {
      queue_id
    } = callback_data;
    const intervalId = setInterval(async () => {
      const {
        success,
        data: {
          message,
          done,
          ping_page
        }
      } = await this.check_finished_install(queue_id);
      if (done) {
        clearInterval(intervalId);
        _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].toggleButton(this.submitButton, true, message, 'white');
        if (ping_page) {
          this.submitButton.classList.add('d-none');
          const goToSpace = document.getElementById('go-to-space');
          goToSpace.classList.remove('d-none');
          goToSpace.setAttribute('href', ping_page);
          location.href = ping_page;
        }
      }
      _tools_Utils__WEBPACK_IMPORTED_MODULE_1__["default"].toggleButton(this.submitButton, true, this.submitButtonLoadingText, 'white');
    }, 3 * 1000);
  },
  async check_finished_install(queue_ui) {
    const data = new URLSearchParams({
      'action': 'check_setup_finished',
      'queue_id': queue_ui
    });
    try {
      const response = await fetch(App.ajax_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data.toString()
      });
      if (!response.ok) {
        return false;
      }
      return await response.json();
    } catch (error) {
      return false;
    }
  }
});

/***/ }),

/***/ "./src/scripts/tools/Submit.js":
/*!*************************************!*\
  !*** ./src/scripts/tools/Submit.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tools_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/Utils */ "./src/scripts/tools/Utils.js");

/* harmony default export */ async function __WEBPACK_DEFAULT_EXPORT__(event) {
  event.preventDefault();
  const formData = new FormData(this.form);
  const errors = this.validateForm(formData);
  _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].toggleButton(this.submitButton, true, this.submitButtonLoadingText, 'white');
  _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].disableFields(this.form);
  if (errors.length > 0) {
    _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].displayMessage(this.message, errors[0], 'error');
    _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].toggleButton(this.submitButton, false, this.submitButtonText);
    _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].enableFields(this.form);
    return;
  }
  try {
    const {
      success,
      data: {
        initial_page,
        message,
        callback,
        callback_data
      }
    } = await this.process_submit(formData);
    if (!success) {
      _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].displayMessage(this.message, message, 'error');
      _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].toggleButton(this.submitButton, false, this.submitButtonText);
      _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].enableFields(this.form);
    } else {
      _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].displayMessage(this.message, message, 'success');
      _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].toggleButton(this.submitButton, false, this.submitButtonSuccessText);
      _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].enableFields(this.form);
      if (callback) {
        this[callback](callback_data);
      }
      if (initial_page) {
        location.href = initial_page;
      }
    }
  } catch (error) {
    console.error('Error:', error);
    _tools_Utils__WEBPACK_IMPORTED_MODULE_0__["default"].toggleButton(this.submitButton, false, this.submitButtonText);
  }
}

/***/ }),

/***/ "./src/scripts/tools/Utils.js":
/*!************************************!*\
  !*** ./src/scripts/tools/Utils.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var alpinejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alpinejs */ "./node_modules/.pnpm/alpinejs@3.14.8/node_modules/alpinejs/dist/module.esm.js");
/* harmony import */ var _kebabcase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./kebabcase */ "./src/scripts/tools/kebabcase.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init() {
    alpinejs__WEBPACK_IMPORTED_MODULE_0__["default"].magic('kebabcase', () => {
      return subject => (0,_kebabcase__WEBPACK_IMPORTED_MODULE_1__["default"])(subject);
    });
  },
  toggleButton(button, disabled, text, loading = undefined, size = 1) {
    if (button) {
      button.disabled = disabled;
      if (loading) {
        const loader = this.loading(loading, size);
        button.innerHTML = '';
        button.appendChild(loader);
        const textContainer = document.createElement('span');
        textContainer.className = 'ml-1';
        textContainer.innerHTML = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)(text);
        button.appendChild(textContainer);
      } else {
        button.innerHTML = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)(text);
      }
    }
  },
  loading(color, size) {
    const validColors = ['primary', 'black', 'white'];
    const validSizes = [1, 2, 3, 4, 5];
    if (!validColors.includes(color)) {
      throw new Error(`Invalid color: ${color}. Valid options are ${validColors.join(', ')}.`);
    }
    if (!validSizes.includes(size)) {
      throw new Error(`Invalid size: ${size}. Valid options are ${validSizes.join(', ')}.`);
    }
    const loadingIcon = document.createElement('span');
    loadingIcon.className = `loading-icon-${color}-${size}`;
    return loadingIcon;
  },
  displayMessage(container, message, type = 'error', spacing = 2) {
    if (!container) return;
    container.innerHTML = message;
    let containerClassNames = [`my-${spacing}`, `p-${spacing}`, 'rounded', 'radius-sm', 'message', 'animate-display', 'is-visible'];
    switch (type) {
      case 'error':
        containerClassNames.push('bg-danger-light');
        containerClassNames.push('text-danger-dark');
        break;
      case 'success':
        containerClassNames.push('bg-success-light');
        containerClassNames.push('text-success-dark');
        break;
      case 'info':
        containerClassNames.push('bg-info-light');
        containerClassNames.push('text-info-dark');
        break;
      case 'warning':
        containerClassNames.push('bg-warning-light');
        containerClassNames.push('text-warning-dark');
        break;
    }
    container.className = containerClassNames.join(' ');
    container.style.display = 'block';
  },
  hideMessage(container) {
    if (!container) return;
    container.innerHTML = '';
    container.className = 'animate-display is-hidden';
  },
  disableFields(element, selector = 'input') {
    element.querySelectorAll(selector).forEach(element => {
      element.disabled = true;
    });
  },
  enableFields(element, selector = 'input') {
    element.querySelectorAll(selector).forEach(element => {
      element.disabled = false;
    });
  }
});

/***/ }),

/***/ "./src/scripts/tools/kebabcase.js":
/*!****************************************!*\
  !*** ./src/scripts/tools/kebabcase.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toKebabCase)
/* harmony export */ });
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2') // Convierte camelCase a kebab-case
  .replace(/\s+/g, '-') // Reemplaza los espacios por guiones
  .toLowerCase(); // Convierte todo a minúsculas
}

/***/ }),

/***/ "./src/scss/app.scss":
/*!***************************!*\
  !*** ./src/scss/app.scss ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/index.js":
/*!******************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/index.js ***!
  \******************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _toDate = _interopRequireDefault(__webpack_require__(/*! ./lib/toDate */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toDate.js"));
var _toFloat = _interopRequireDefault(__webpack_require__(/*! ./lib/toFloat */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toFloat.js"));
var _toInt = _interopRequireDefault(__webpack_require__(/*! ./lib/toInt */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toInt.js"));
var _toBoolean = _interopRequireDefault(__webpack_require__(/*! ./lib/toBoolean */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toBoolean.js"));
var _equals = _interopRequireDefault(__webpack_require__(/*! ./lib/equals */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/equals.js"));
var _contains = _interopRequireDefault(__webpack_require__(/*! ./lib/contains */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/contains.js"));
var _matches = _interopRequireDefault(__webpack_require__(/*! ./lib/matches */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/matches.js"));
var _isEmail = _interopRequireDefault(__webpack_require__(/*! ./lib/isEmail */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEmail.js"));
var _isURL = _interopRequireDefault(__webpack_require__(/*! ./lib/isURL */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isURL.js"));
var _isMACAddress = _interopRequireDefault(__webpack_require__(/*! ./lib/isMACAddress */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMACAddress.js"));
var _isIP = _interopRequireDefault(__webpack_require__(/*! ./lib/isIP */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIP.js"));
var _isIPRange = _interopRequireDefault(__webpack_require__(/*! ./lib/isIPRange */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIPRange.js"));
var _isFQDN = _interopRequireDefault(__webpack_require__(/*! ./lib/isFQDN */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFQDN.js"));
var _isDate = _interopRequireDefault(__webpack_require__(/*! ./lib/isDate */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDate.js"));
var _isTime = _interopRequireDefault(__webpack_require__(/*! ./lib/isTime */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isTime.js"));
var _isBoolean = _interopRequireDefault(__webpack_require__(/*! ./lib/isBoolean */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBoolean.js"));
var _isLocale = _interopRequireDefault(__webpack_require__(/*! ./lib/isLocale */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLocale.js"));
var _isAbaRouting = _interopRequireDefault(__webpack_require__(/*! ./lib/isAbaRouting */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAbaRouting.js"));
var _isAlpha = _interopRequireWildcard(__webpack_require__(/*! ./lib/isAlpha */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAlpha.js"));
var _isAlphanumeric = _interopRequireWildcard(__webpack_require__(/*! ./lib/isAlphanumeric */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAlphanumeric.js"));
var _isNumeric = _interopRequireDefault(__webpack_require__(/*! ./lib/isNumeric */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isNumeric.js"));
var _isPassportNumber = _interopRequireDefault(__webpack_require__(/*! ./lib/isPassportNumber */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isPassportNumber.js"));
var _isPort = _interopRequireDefault(__webpack_require__(/*! ./lib/isPort */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isPort.js"));
var _isLowercase = _interopRequireDefault(__webpack_require__(/*! ./lib/isLowercase */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLowercase.js"));
var _isUppercase = _interopRequireDefault(__webpack_require__(/*! ./lib/isUppercase */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isUppercase.js"));
var _isIMEI = _interopRequireDefault(__webpack_require__(/*! ./lib/isIMEI */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIMEI.js"));
var _isAscii = _interopRequireDefault(__webpack_require__(/*! ./lib/isAscii */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAscii.js"));
var _isFullWidth = _interopRequireDefault(__webpack_require__(/*! ./lib/isFullWidth */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFullWidth.js"));
var _isHalfWidth = _interopRequireDefault(__webpack_require__(/*! ./lib/isHalfWidth */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHalfWidth.js"));
var _isVariableWidth = _interopRequireDefault(__webpack_require__(/*! ./lib/isVariableWidth */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isVariableWidth.js"));
var _isMultibyte = _interopRequireDefault(__webpack_require__(/*! ./lib/isMultibyte */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMultibyte.js"));
var _isSemVer = _interopRequireDefault(__webpack_require__(/*! ./lib/isSemVer */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isSemVer.js"));
var _isSurrogatePair = _interopRequireDefault(__webpack_require__(/*! ./lib/isSurrogatePair */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isSurrogatePair.js"));
var _isInt = _interopRequireDefault(__webpack_require__(/*! ./lib/isInt */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isInt.js"));
var _isFloat = _interopRequireWildcard(__webpack_require__(/*! ./lib/isFloat */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFloat.js"));
var _isDecimal = _interopRequireDefault(__webpack_require__(/*! ./lib/isDecimal */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDecimal.js"));
var _isHexadecimal = _interopRequireDefault(__webpack_require__(/*! ./lib/isHexadecimal */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHexadecimal.js"));
var _isOctal = _interopRequireDefault(__webpack_require__(/*! ./lib/isOctal */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isOctal.js"));
var _isDivisibleBy = _interopRequireDefault(__webpack_require__(/*! ./lib/isDivisibleBy */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDivisibleBy.js"));
var _isHexColor = _interopRequireDefault(__webpack_require__(/*! ./lib/isHexColor */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHexColor.js"));
var _isRgbColor = _interopRequireDefault(__webpack_require__(/*! ./lib/isRgbColor */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isRgbColor.js"));
var _isHSL = _interopRequireDefault(__webpack_require__(/*! ./lib/isHSL */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHSL.js"));
var _isISRC = _interopRequireDefault(__webpack_require__(/*! ./lib/isISRC */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISRC.js"));
var _isIBAN = _interopRequireWildcard(__webpack_require__(/*! ./lib/isIBAN */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIBAN.js"));
var _isBIC = _interopRequireDefault(__webpack_require__(/*! ./lib/isBIC */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBIC.js"));
var _isMD = _interopRequireDefault(__webpack_require__(/*! ./lib/isMD5 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMD5.js"));
var _isHash = _interopRequireDefault(__webpack_require__(/*! ./lib/isHash */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHash.js"));
var _isJWT = _interopRequireDefault(__webpack_require__(/*! ./lib/isJWT */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isJWT.js"));
var _isJSON = _interopRequireDefault(__webpack_require__(/*! ./lib/isJSON */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isJSON.js"));
var _isEmpty = _interopRequireDefault(__webpack_require__(/*! ./lib/isEmpty */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEmpty.js"));
var _isLength = _interopRequireDefault(__webpack_require__(/*! ./lib/isLength */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLength.js"));
var _isByteLength = _interopRequireDefault(__webpack_require__(/*! ./lib/isByteLength */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isByteLength.js"));
var _isUUID = _interopRequireDefault(__webpack_require__(/*! ./lib/isUUID */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isUUID.js"));
var _isMongoId = _interopRequireDefault(__webpack_require__(/*! ./lib/isMongoId */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMongoId.js"));
var _isAfter = _interopRequireDefault(__webpack_require__(/*! ./lib/isAfter */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAfter.js"));
var _isBefore = _interopRequireDefault(__webpack_require__(/*! ./lib/isBefore */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBefore.js"));
var _isIn = _interopRequireDefault(__webpack_require__(/*! ./lib/isIn */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIn.js"));
var _isLuhnNumber = _interopRequireDefault(__webpack_require__(/*! ./lib/isLuhnNumber */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLuhnNumber.js"));
var _isCreditCard = _interopRequireDefault(__webpack_require__(/*! ./lib/isCreditCard */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isCreditCard.js"));
var _isIdentityCard = _interopRequireDefault(__webpack_require__(/*! ./lib/isIdentityCard */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIdentityCard.js"));
var _isEAN = _interopRequireDefault(__webpack_require__(/*! ./lib/isEAN */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEAN.js"));
var _isISIN = _interopRequireDefault(__webpack_require__(/*! ./lib/isISIN */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISIN.js"));
var _isISBN = _interopRequireDefault(__webpack_require__(/*! ./lib/isISBN */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISBN.js"));
var _isISSN = _interopRequireDefault(__webpack_require__(/*! ./lib/isISSN */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISSN.js"));
var _isTaxID = _interopRequireDefault(__webpack_require__(/*! ./lib/isTaxID */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isTaxID.js"));
var _isMobilePhone = _interopRequireWildcard(__webpack_require__(/*! ./lib/isMobilePhone */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMobilePhone.js"));
var _isEthereumAddress = _interopRequireDefault(__webpack_require__(/*! ./lib/isEthereumAddress */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEthereumAddress.js"));
var _isCurrency = _interopRequireDefault(__webpack_require__(/*! ./lib/isCurrency */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isCurrency.js"));
var _isBtcAddress = _interopRequireDefault(__webpack_require__(/*! ./lib/isBtcAddress */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBtcAddress.js"));
var _isISO = __webpack_require__(/*! ./lib/isISO6346 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO6346.js");
var _isISO2 = _interopRequireDefault(__webpack_require__(/*! ./lib/isISO6391 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO6391.js"));
var _isISO3 = _interopRequireDefault(__webpack_require__(/*! ./lib/isISO8601 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO8601.js"));
var _isRFC = _interopRequireDefault(__webpack_require__(/*! ./lib/isRFC3339 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isRFC3339.js"));
var _isISO31661Alpha = _interopRequireDefault(__webpack_require__(/*! ./lib/isISO31661Alpha2 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO31661Alpha2.js"));
var _isISO31661Alpha2 = _interopRequireDefault(__webpack_require__(/*! ./lib/isISO31661Alpha3 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO31661Alpha3.js"));
var _isISO4 = _interopRequireDefault(__webpack_require__(/*! ./lib/isISO4217 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO4217.js"));
var _isBase = _interopRequireDefault(__webpack_require__(/*! ./lib/isBase32 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase32.js"));
var _isBase2 = _interopRequireDefault(__webpack_require__(/*! ./lib/isBase58 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase58.js"));
var _isBase3 = _interopRequireDefault(__webpack_require__(/*! ./lib/isBase64 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase64.js"));
var _isDataURI = _interopRequireDefault(__webpack_require__(/*! ./lib/isDataURI */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDataURI.js"));
var _isMagnetURI = _interopRequireDefault(__webpack_require__(/*! ./lib/isMagnetURI */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMagnetURI.js"));
var _isMailtoURI = _interopRequireDefault(__webpack_require__(/*! ./lib/isMailtoURI */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMailtoURI.js"));
var _isMimeType = _interopRequireDefault(__webpack_require__(/*! ./lib/isMimeType */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMimeType.js"));
var _isLatLong = _interopRequireDefault(__webpack_require__(/*! ./lib/isLatLong */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLatLong.js"));
var _isPostalCode = _interopRequireWildcard(__webpack_require__(/*! ./lib/isPostalCode */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isPostalCode.js"));
var _ltrim = _interopRequireDefault(__webpack_require__(/*! ./lib/ltrim */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/ltrim.js"));
var _rtrim = _interopRequireDefault(__webpack_require__(/*! ./lib/rtrim */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/rtrim.js"));
var _trim = _interopRequireDefault(__webpack_require__(/*! ./lib/trim */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/trim.js"));
var _escape = _interopRequireDefault(__webpack_require__(/*! ./lib/escape */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/escape.js"));
var _unescape = _interopRequireDefault(__webpack_require__(/*! ./lib/unescape */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/unescape.js"));
var _stripLow = _interopRequireDefault(__webpack_require__(/*! ./lib/stripLow */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/stripLow.js"));
var _whitelist = _interopRequireDefault(__webpack_require__(/*! ./lib/whitelist */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/whitelist.js"));
var _blacklist = _interopRequireDefault(__webpack_require__(/*! ./lib/blacklist */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/blacklist.js"));
var _isWhitelisted = _interopRequireDefault(__webpack_require__(/*! ./lib/isWhitelisted */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isWhitelisted.js"));
var _normalizeEmail = _interopRequireDefault(__webpack_require__(/*! ./lib/normalizeEmail */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/normalizeEmail.js"));
var _isSlug = _interopRequireDefault(__webpack_require__(/*! ./lib/isSlug */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isSlug.js"));
var _isLicensePlate = _interopRequireDefault(__webpack_require__(/*! ./lib/isLicensePlate */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLicensePlate.js"));
var _isStrongPassword = _interopRequireDefault(__webpack_require__(/*! ./lib/isStrongPassword */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isStrongPassword.js"));
var _isVAT = _interopRequireDefault(__webpack_require__(/*! ./lib/isVAT */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isVAT.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var version = '13.12.0';
var validator = {
  version: version,
  toDate: _toDate.default,
  toFloat: _toFloat.default,
  toInt: _toInt.default,
  toBoolean: _toBoolean.default,
  equals: _equals.default,
  contains: _contains.default,
  matches: _matches.default,
  isEmail: _isEmail.default,
  isURL: _isURL.default,
  isMACAddress: _isMACAddress.default,
  isIP: _isIP.default,
  isIPRange: _isIPRange.default,
  isFQDN: _isFQDN.default,
  isBoolean: _isBoolean.default,
  isIBAN: _isIBAN.default,
  isBIC: _isBIC.default,
  isAbaRouting: _isAbaRouting.default,
  isAlpha: _isAlpha.default,
  isAlphaLocales: _isAlpha.locales,
  isAlphanumeric: _isAlphanumeric.default,
  isAlphanumericLocales: _isAlphanumeric.locales,
  isNumeric: _isNumeric.default,
  isPassportNumber: _isPassportNumber.default,
  isPort: _isPort.default,
  isLowercase: _isLowercase.default,
  isUppercase: _isUppercase.default,
  isAscii: _isAscii.default,
  isFullWidth: _isFullWidth.default,
  isHalfWidth: _isHalfWidth.default,
  isVariableWidth: _isVariableWidth.default,
  isMultibyte: _isMultibyte.default,
  isSemVer: _isSemVer.default,
  isSurrogatePair: _isSurrogatePair.default,
  isInt: _isInt.default,
  isIMEI: _isIMEI.default,
  isFloat: _isFloat.default,
  isFloatLocales: _isFloat.locales,
  isDecimal: _isDecimal.default,
  isHexadecimal: _isHexadecimal.default,
  isOctal: _isOctal.default,
  isDivisibleBy: _isDivisibleBy.default,
  isHexColor: _isHexColor.default,
  isRgbColor: _isRgbColor.default,
  isHSL: _isHSL.default,
  isISRC: _isISRC.default,
  isMD5: _isMD.default,
  isHash: _isHash.default,
  isJWT: _isJWT.default,
  isJSON: _isJSON.default,
  isEmpty: _isEmpty.default,
  isLength: _isLength.default,
  isLocale: _isLocale.default,
  isByteLength: _isByteLength.default,
  isUUID: _isUUID.default,
  isMongoId: _isMongoId.default,
  isAfter: _isAfter.default,
  isBefore: _isBefore.default,
  isIn: _isIn.default,
  isLuhnNumber: _isLuhnNumber.default,
  isCreditCard: _isCreditCard.default,
  isIdentityCard: _isIdentityCard.default,
  isEAN: _isEAN.default,
  isISIN: _isISIN.default,
  isISBN: _isISBN.default,
  isISSN: _isISSN.default,
  isMobilePhone: _isMobilePhone.default,
  isMobilePhoneLocales: _isMobilePhone.locales,
  isPostalCode: _isPostalCode.default,
  isPostalCodeLocales: _isPostalCode.locales,
  isEthereumAddress: _isEthereumAddress.default,
  isCurrency: _isCurrency.default,
  isBtcAddress: _isBtcAddress.default,
  isISO6346: _isISO.isISO6346,
  isFreightContainerID: _isISO.isFreightContainerID,
  isISO6391: _isISO2.default,
  isISO8601: _isISO3.default,
  isRFC3339: _isRFC.default,
  isISO31661Alpha2: _isISO31661Alpha.default,
  isISO31661Alpha3: _isISO31661Alpha2.default,
  isISO4217: _isISO4.default,
  isBase32: _isBase.default,
  isBase58: _isBase2.default,
  isBase64: _isBase3.default,
  isDataURI: _isDataURI.default,
  isMagnetURI: _isMagnetURI.default,
  isMailtoURI: _isMailtoURI.default,
  isMimeType: _isMimeType.default,
  isLatLong: _isLatLong.default,
  ltrim: _ltrim.default,
  rtrim: _rtrim.default,
  trim: _trim.default,
  escape: _escape.default,
  unescape: _unescape.default,
  stripLow: _stripLow.default,
  whitelist: _whitelist.default,
  blacklist: _blacklist.default,
  isWhitelisted: _isWhitelisted.default,
  normalizeEmail: _normalizeEmail.default,
  toString: toString,
  isSlug: _isSlug.default,
  isStrongPassword: _isStrongPassword.default,
  isTaxID: _isTaxID.default,
  isDate: _isDate.default,
  isTime: _isTime.default,
  isLicensePlate: _isLicensePlate.default,
  isVAT: _isVAT.default,
  ibanLocales: _isIBAN.locales
};
var _default = exports["default"] = validator;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/alpha.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/alpha.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.farsiLocales = exports.englishLocales = exports.dotDecimal = exports.decimal = exports.commaDecimal = exports.bengaliLocales = exports.arabicLocales = exports.alphanumeric = exports.alpha = void 0;
var alpha = exports.alpha = {
  'en-US': /^[A-Z]+$/i,
  'az-AZ': /^[A-VXYZÇƏĞİıÖŞÜ]+$/i,
  'bg-BG': /^[А-Я]+$/i,
  'cs-CZ': /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'da-DK': /^[A-ZÆØÅ]+$/i,
  'de-DE': /^[A-ZÄÖÜß]+$/i,
  'el-GR': /^[Α-ώ]+$/i,
  'es-ES': /^[A-ZÁÉÍÑÓÚÜ]+$/i,
  'fa-IR': /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/i,
  'fi-FI': /^[A-ZÅÄÖ]+$/i,
  'fr-FR': /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'it-IT': /^[A-ZÀÉÈÌÎÓÒÙ]+$/i,
  'ja-JP': /^[ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
  'nb-NO': /^[A-ZÆØÅ]+$/i,
  'nl-NL': /^[A-ZÁÉËÏÓÖÜÚ]+$/i,
  'nn-NO': /^[A-ZÆØÅ]+$/i,
  'hu-HU': /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'pl-PL': /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  'ru-RU': /^[А-ЯЁ]+$/i,
  'kk-KZ': /^[А-ЯЁ\u04D8\u04B0\u0406\u04A2\u0492\u04AE\u049A\u04E8\u04BA]+$/i,
  'sl-SI': /^[A-ZČĆĐŠŽ]+$/i,
  'sk-SK': /^[A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  'sr-RS@latin': /^[A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[А-ЯЂЈЉЊЋЏ]+$/i,
  'sv-SE': /^[A-ZÅÄÖ]+$/i,
  'th-TH': /^[ก-๐\s]+$/i,
  'tr-TR': /^[A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[А-ЩЬЮЯЄIЇҐі]+$/i,
  'vi-VN': /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  'ko-KR': /^[ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
  'ku-IQ': /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[א-ת]+$/,
  fa: /^['آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی']+$/i,
  bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
  eo: /^[ABCĈD-GĜHĤIJĴK-PRSŜTUŬVZ]+$/i,
  'hi-IN': /^[\u0900-\u0961]+[\u0972-\u097F]*$/i,
  'si-LK': /^[\u0D80-\u0DFF]+$/
};
var alphanumeric = exports.alphanumeric = {
  'en-US': /^[0-9A-Z]+$/i,
  'az-AZ': /^[0-9A-VXYZÇƏĞİıÖŞÜ]+$/i,
  'bg-BG': /^[0-9А-Я]+$/i,
  'cs-CZ': /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  'da-DK': /^[0-9A-ZÆØÅ]+$/i,
  'de-DE': /^[0-9A-ZÄÖÜß]+$/i,
  'el-GR': /^[0-9Α-ω]+$/i,
  'es-ES': /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
  'fi-FI': /^[0-9A-ZÅÄÖ]+$/i,
  'fr-FR': /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'it-IT': /^[0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
  'ja-JP': /^[0-9０-９ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
  'hu-HU': /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  'nb-NO': /^[0-9A-ZÆØÅ]+$/i,
  'nl-NL': /^[0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
  'nn-NO': /^[0-9A-ZÆØÅ]+$/i,
  'pl-PL': /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  'pt-PT': /^[0-9A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
  'ru-RU': /^[0-9А-ЯЁ]+$/i,
  'kk-KZ': /^[0-9А-ЯЁ\u04D8\u04B0\u0406\u04A2\u0492\u04AE\u049A\u04E8\u04BA]+$/i,
  'sl-SI': /^[0-9A-ZČĆĐŠŽ]+$/i,
  'sk-SK': /^[0-9A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  'sr-RS@latin': /^[0-9A-ZČĆŽŠĐ]+$/i,
  'sr-RS': /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
  'sv-SE': /^[0-9A-ZÅÄÖ]+$/i,
  'th-TH': /^[ก-๙\s]+$/i,
  'tr-TR': /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[0-9А-ЩЬЮЯЄIЇҐі]+$/i,
  'ko-KR': /^[0-9ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
  'ku-IQ': /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  'vi-VN': /^[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  he: /^[0-9א-ת]+$/,
  fa: /^['0-9آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی۱۲۳۴۵۶۷۸۹۰']+$/i,
  bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣ০১২৩৪৫৬৭৮৯ৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
  eo: /^[0-9ABCĈD-GĜHĤIJĴK-PRSŜTUŬVZ]+$/i,
  'hi-IN': /^[\u0900-\u0963]+[\u0966-\u097F]*$/i,
  'si-LK': /^[0-9\u0D80-\u0DFF]+$/
};
var decimal = exports.decimal = {
  'en-US': '.',
  ar: '٫'
};
var englishLocales = exports.englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM'];
for (var locale, i = 0; i < englishLocales.length; i++) {
  locale = "en-".concat(englishLocales[i]);
  alpha[locale] = alpha['en-US'];
  alphanumeric[locale] = alphanumeric['en-US'];
  decimal[locale] = decimal['en-US'];
}

// Source: http://www.localeplanet.com/java/
var arabicLocales = exports.arabicLocales = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'QM', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE'];
for (var _locale, _i = 0; _i < arabicLocales.length; _i++) {
  _locale = "ar-".concat(arabicLocales[_i]);
  alpha[_locale] = alpha.ar;
  alphanumeric[_locale] = alphanumeric.ar;
  decimal[_locale] = decimal.ar;
}
var farsiLocales = exports.farsiLocales = ['IR', 'AF'];
for (var _locale2, _i2 = 0; _i2 < farsiLocales.length; _i2++) {
  _locale2 = "fa-".concat(farsiLocales[_i2]);
  alphanumeric[_locale2] = alphanumeric.fa;
  decimal[_locale2] = decimal.ar;
}
var bengaliLocales = exports.bengaliLocales = ['BD', 'IN'];
for (var _locale3, _i3 = 0; _i3 < bengaliLocales.length; _i3++) {
  _locale3 = "bn-".concat(bengaliLocales[_i3]);
  alpha[_locale3] = alpha.bn;
  alphanumeric[_locale3] = alphanumeric.bn;
  decimal[_locale3] = decimal['en-US'];
}

// Source: https://en.wikipedia.org/wiki/Decimal_mark
var dotDecimal = exports.dotDecimal = ['ar-EG', 'ar-LB', 'ar-LY'];
var commaDecimal = exports.commaDecimal = ['bg-BG', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-ZM', 'eo', 'es-ES', 'fr-CA', 'fr-FR', 'id-ID', 'it-IT', 'ku-IQ', 'hi-IN', 'hu-HU', 'nb-NO', 'nn-NO', 'nl-NL', 'pl-PL', 'pt-PT', 'ru-RU', 'kk-KZ', 'si-LK', 'sl-SI', 'sr-RS@latin', 'sr-RS', 'sv-SE', 'tr-TR', 'uk-UA', 'vi-VN'];
for (var _i4 = 0; _i4 < dotDecimal.length; _i4++) {
  decimal[dotDecimal[_i4]] = decimal['en-US'];
}
for (var _i5 = 0; _i5 < commaDecimal.length; _i5++) {
  decimal[commaDecimal[_i5]] = ',';
}
alpha['fr-CA'] = alpha['fr-FR'];
alphanumeric['fr-CA'] = alphanumeric['fr-FR'];
alpha['pt-BR'] = alpha['pt-PT'];
alphanumeric['pt-BR'] = alphanumeric['pt-PT'];
decimal['pt-BR'] = decimal['pt-PT'];

// see #862
alpha['pl-Pl'] = alpha['pl-PL'];
alphanumeric['pl-Pl'] = alphanumeric['pl-PL'];
decimal['pl-Pl'] = decimal['pl-PL'];

// see #1455
alpha['fa-AF'] = alpha.fa;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/blacklist.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/blacklist.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = blacklist;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function blacklist(str, chars) {
  (0, _assertString.default)(str);
  return str.replace(new RegExp("[".concat(chars, "]+"), 'g'), '');
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/contains.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/contains.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = contains;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _toString = _interopRequireDefault(__webpack_require__(/*! ./util/toString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/toString.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var defaulContainsOptions = {
  ignoreCase: false,
  minOccurrences: 1
};
function contains(str, elem, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, defaulContainsOptions);
  if (options.ignoreCase) {
    return str.toLowerCase().split((0, _toString.default)(elem).toLowerCase()).length > options.minOccurrences;
  }
  return str.split((0, _toString.default)(elem)).length > options.minOccurrences;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/equals.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/equals.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = equals;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function equals(str, comparison) {
  (0, _assertString.default)(str);
  return str === comparison;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/escape.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/escape.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = escape;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function escape(str) {
  (0, _assertString.default)(str);
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;').replace(/\\/g, '&#x5C;').replace(/`/g, '&#96;');
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAbaRouting.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAbaRouting.js ***!
  \*****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isAbaRouting;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// http://www.brainjar.com/js/validation/
// https://www.aba.com/news-research/research-analysis/routing-number-policy-procedures
// series reserved for future use are excluded
var isRoutingReg = /^(?!(1[3-9])|(20)|(3[3-9])|(4[0-9])|(5[0-9])|(60)|(7[3-9])|(8[1-9])|(9[0-2])|(9[3-9]))[0-9]{9}$/;
function isAbaRouting(str) {
  (0, _assertString.default)(str);
  if (!isRoutingReg.test(str)) return false;
  var checkSumVal = 0;
  for (var i = 0; i < str.length; i++) {
    if (i % 3 === 0) checkSumVal += str[i] * 3;else if (i % 3 === 1) checkSumVal += str[i] * 7;else checkSumVal += str[i] * 1;
  }
  return checkSumVal % 10 === 0;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAfter.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAfter.js ***!
  \************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isAfter;
var _toDate = _interopRequireDefault(__webpack_require__(/*! ./toDate */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toDate.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isAfter(date, options) {
  // For backwards compatibility:
  // isAfter(str [, date]), i.e. `options` could be used as argument for the legacy `date`
  var comparisonDate = (options === null || options === void 0 ? void 0 : options.comparisonDate) || options || Date().toString();
  var comparison = (0, _toDate.default)(comparisonDate);
  var original = (0, _toDate.default)(date);
  return !!(original && comparison && original > comparison);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAlpha.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAlpha.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isAlpha;
exports.locales = void 0;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _alpha = __webpack_require__(/*! ./alpha */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/alpha.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isAlpha(_str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  (0, _assertString.default)(_str);
  var str = _str;
  var ignore = options.ignore;
  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, '');
    } else if (typeof ignore === 'string') {
      str = str.replace(new RegExp("[".concat(ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&'), "]"), 'g'), ''); // escape regex for ignore
    } else {
      throw new Error('ignore should be instance of a String or RegExp');
    }
  }
  if (locale in _alpha.alpha) {
    return _alpha.alpha[locale].test(str);
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
var locales = exports.locales = Object.keys(_alpha.alpha);

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAlphanumeric.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAlphanumeric.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isAlphanumeric;
exports.locales = void 0;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _alpha = __webpack_require__(/*! ./alpha */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/alpha.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isAlphanumeric(_str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  (0, _assertString.default)(_str);
  var str = _str;
  var ignore = options.ignore;
  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, '');
    } else if (typeof ignore === 'string') {
      str = str.replace(new RegExp("[".concat(ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, '\\$&'), "]"), 'g'), ''); // escape regex for ignore
    } else {
      throw new Error('ignore should be instance of a String or RegExp');
    }
  }
  if (locale in _alpha.alphanumeric) {
    return _alpha.alphanumeric[locale].test(str);
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
var locales = exports.locales = Object.keys(_alpha.alphanumeric);

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAscii.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isAscii.js ***!
  \************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isAscii;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable no-control-regex */
var ascii = /^[\x00-\x7F]+$/;
/* eslint-enable no-control-regex */

function isAscii(str) {
  (0, _assertString.default)(str);
  return ascii.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBIC.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBIC.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isBIC;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _isISO31661Alpha = __webpack_require__(/*! ./isISO31661Alpha2 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO31661Alpha2.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// https://en.wikipedia.org/wiki/ISO_9362
var isBICReg = /^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/;
function isBIC(str) {
  (0, _assertString.default)(str);

  // toUpperCase() should be removed when a new major version goes out that changes
  // the regex to [A-Z] (per the spec).
  var countryCode = str.slice(4, 6).toUpperCase();
  if (!_isISO31661Alpha.CountryCodes.has(countryCode) && countryCode !== 'XK') {
    return false;
  }
  return isBICReg.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase32.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase32.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isBase32;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var base32 = /^[A-Z2-7]+=*$/;
var crockfordBase32 = /^[A-HJKMNP-TV-Z0-9]+$/;
var defaultBase32Options = {
  crockford: false
};
function isBase32(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, defaultBase32Options);
  if (options.crockford) {
    return crockfordBase32.test(str);
  }
  var len = str.length;
  if (len % 8 === 0 && base32.test(str)) {
    return true;
  }
  return false;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase58.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase58.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isBase58;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Accepted chars - 123456789ABCDEFGH JKLMN PQRSTUVWXYZabcdefghijk mnopqrstuvwxyz
var base58Reg = /^[A-HJ-NP-Za-km-z1-9]*$/;
function isBase58(str) {
  (0, _assertString.default)(str);
  if (base58Reg.test(str)) {
    return true;
  }
  return false;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase64.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase64.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isBase64;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var notBase64 = /[^A-Z0-9+\/=]/i;
var urlSafeBase64 = /^[A-Z0-9_\-]*$/i;
var defaultBase64Options = {
  urlSafe: false
};
function isBase64(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, defaultBase64Options);
  var len = str.length;
  if (options.urlSafe) {
    return urlSafeBase64.test(str);
  }
  if (len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }
  var firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 || firstPaddingChar === len - 1 || firstPaddingChar === len - 2 && str[len - 1] === '=';
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBefore.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBefore.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isBefore;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _toDate = _interopRequireDefault(__webpack_require__(/*! ./toDate */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toDate.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isBefore(str) {
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : String(new Date());
  (0, _assertString.default)(str);
  var comparison = (0, _toDate.default)(date);
  var original = (0, _toDate.default)(str);
  return !!(original && comparison && original < comparison);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBoolean.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBoolean.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isBoolean;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var defaultOptions = {
  loose: false
};
var strictBooleans = ['true', 'false', '1', '0'];
var looseBooleans = [].concat(strictBooleans, ['yes', 'no']);
function isBoolean(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;
  (0, _assertString.default)(str);
  if (options.loose) {
    return looseBooleans.includes(str.toLowerCase());
  }
  return strictBooleans.includes(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBtcAddress.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBtcAddress.js ***!
  \*****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isBtcAddress;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var bech32 = /^(bc1)[a-z0-9]{25,39}$/;
var base58 = /^(1|3)[A-HJ-NP-Za-km-z1-9]{25,39}$/;
function isBtcAddress(str) {
  (0, _assertString.default)(str);
  return bech32.test(str) || base58.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isByteLength.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isByteLength.js ***!
  \*****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isByteLength;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* eslint-disable prefer-rest-params */
function isByteLength(str, options) {
  (0, _assertString.default)(str);
  var min;
  var max;
  if (_typeof(options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1];
    max = arguments[2];
  }
  var len = encodeURI(str).split(/%..|./).length - 1;
  return len >= min && (typeof max === 'undefined' || len <= max);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isCreditCard.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isCreditCard.js ***!
  \*****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isCreditCard;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _isLuhnNumber = _interopRequireDefault(__webpack_require__(/*! ./isLuhnNumber */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLuhnNumber.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var cards = {
  amex: /^3[47][0-9]{13}$/,
  dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  discover: /^6(?:011|5[0-9][0-9])[0-9]{12,15}$/,
  jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
  mastercard: /^5[1-5][0-9]{2}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
  // /^[25][1-7][0-9]{14}$/;
  unionpay: /^(6[27][0-9]{14}|^(81[0-9]{14,17}))$/,
  visa: /^(?:4[0-9]{12})(?:[0-9]{3,6})?$/
};
var allCards = function () {
  var tmpCardsArray = [];
  for (var cardProvider in cards) {
    // istanbul ignore else
    if (cards.hasOwnProperty(cardProvider)) {
      tmpCardsArray.push(cards[cardProvider]);
    }
  }
  return tmpCardsArray;
}();
function isCreditCard(card) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _assertString.default)(card);
  var provider = options.provider;
  var sanitized = card.replace(/[- ]+/g, '');
  if (provider && provider.toLowerCase() in cards) {
    // specific provider in the list
    if (!cards[provider.toLowerCase()].test(sanitized)) {
      return false;
    }
  } else if (provider && !(provider.toLowerCase() in cards)) {
    /* specific provider not in the list */
    throw new Error("".concat(provider, " is not a valid credit card provider."));
  } else if (!allCards.some(function (cardProvider) {
    return cardProvider.test(sanitized);
  })) {
    // no specific provider
    return false;
  }
  return (0, _isLuhnNumber.default)(card);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isCurrency.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isCurrency.js ***!
  \***************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isCurrency;
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function currencyRegex(options) {
  var decimal_digits = "\\d{".concat(options.digits_after_decimal[0], "}");
  options.digits_after_decimal.forEach(function (digit, index) {
    if (index !== 0) decimal_digits = "".concat(decimal_digits, "|\\d{").concat(digit, "}");
  });
  var symbol = "(".concat(options.symbol.replace(/\W/, function (m) {
      return "\\".concat(m);
    }), ")").concat(options.require_symbol ? '' : '?'),
    negative = '-?',
    whole_dollar_amount_without_sep = '[1-9]\\d*',
    whole_dollar_amount_with_sep = "[1-9]\\d{0,2}(\\".concat(options.thousands_separator, "\\d{3})*"),
    valid_whole_dollar_amounts = ['0', whole_dollar_amount_without_sep, whole_dollar_amount_with_sep],
    whole_dollar_amount = "(".concat(valid_whole_dollar_amounts.join('|'), ")?"),
    decimal_amount = "(\\".concat(options.decimal_separator, "(").concat(decimal_digits, "))").concat(options.require_decimal ? '' : '?');
  var pattern = whole_dollar_amount + (options.allow_decimal || options.require_decimal ? decimal_amount : '');

  // default is negative sign before symbol, but there are two other options (besides parens)
  if (options.allow_negatives && !options.parens_for_negatives) {
    if (options.negative_sign_after_digits) {
      pattern += negative;
    } else if (options.negative_sign_before_digits) {
      pattern = negative + pattern;
    }
  }

  // South African Rand, for example, uses R 123 (space) and R-123 (no space)
  if (options.allow_negative_sign_placeholder) {
    pattern = "( (?!\\-))?".concat(pattern);
  } else if (options.allow_space_after_symbol) {
    pattern = " ?".concat(pattern);
  } else if (options.allow_space_after_digits) {
    pattern += '( (?!$))?';
  }
  if (options.symbol_after_digits) {
    pattern += symbol;
  } else {
    pattern = symbol + pattern;
  }
  if (options.allow_negatives) {
    if (options.parens_for_negatives) {
      pattern = "(\\(".concat(pattern, "\\)|").concat(pattern, ")");
    } else if (!(options.negative_sign_before_digits || options.negative_sign_after_digits)) {
      pattern = negative + pattern;
    }
  }

  // ensure there's a dollar and/or decimal amount, and that
  // it doesn't start with a space or a negative sign followed by a space
  return new RegExp("^(?!-? )(?=.*\\d)".concat(pattern, "$"));
}
var default_currency_options = {
  symbol: '$',
  require_symbol: false,
  allow_space_after_symbol: false,
  symbol_after_digits: false,
  allow_negatives: true,
  parens_for_negatives: false,
  negative_sign_before_digits: false,
  negative_sign_after_digits: false,
  allow_negative_sign_placeholder: false,
  thousands_separator: ',',
  decimal_separator: '.',
  allow_decimal: true,
  require_decimal: false,
  digits_after_decimal: [2],
  allow_space_after_digits: false
};
function isCurrency(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_currency_options);
  return currencyRegex(options).test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDataURI.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDataURI.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isDataURI;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var validMediaType = /^[a-z]+\/[a-z0-9\-\+\._]+$/i;
var validAttribute = /^[a-z\-]+=[a-z0-9\-]+$/i;
var validData = /^[a-z0-9!\$&'\(\)\*\+,;=\-\._~:@\/\?%\s]*$/i;
function isDataURI(str) {
  (0, _assertString.default)(str);
  var data = str.split(',');
  if (data.length < 2) {
    return false;
  }
  var attributes = data.shift().trim().split(';');
  var schemeAndMediaType = attributes.shift();
  if (schemeAndMediaType.slice(0, 5) !== 'data:') {
    return false;
  }
  var mediaType = schemeAndMediaType.slice(5);
  if (mediaType !== '' && !validMediaType.test(mediaType)) {
    return false;
  }
  for (var i = 0; i < attributes.length; i++) {
    if (!(i === attributes.length - 1 && attributes[i].toLowerCase() === 'base64') && !validAttribute.test(attributes[i])) {
      return false;
    }
  }
  for (var _i = 0; _i < data.length; _i++) {
    if (!validData.test(data[_i])) {
      return false;
    }
  }
  return true;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDate.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDate.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isDate;
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var default_date_options = {
  format: 'YYYY/MM/DD',
  delimiters: ['/', '-'],
  strictMode: false
};
function isValidFormat(format) {
  return /(^(y{4}|y{2})[.\/-](m{1,2})[.\/-](d{1,2})$)|(^(m{1,2})[.\/-](d{1,2})[.\/-]((y{4}|y{2})$))|(^(d{1,2})[.\/-](m{1,2})[.\/-]((y{4}|y{2})$))/gi.test(format);
}
function zip(date, format) {
  var zippedArr = [],
    len = Math.min(date.length, format.length);
  for (var i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]]);
  }
  return zippedArr;
}
function isDate(input, options) {
  if (typeof options === 'string') {
    // Allow backward compatibility for old format isDate(input [, format])
    options = (0, _merge.default)({
      format: options
    }, default_date_options);
  } else {
    options = (0, _merge.default)(options, default_date_options);
  }
  if (typeof input === 'string' && isValidFormat(options.format)) {
    var formatDelimiter = options.delimiters.find(function (delimiter) {
      return options.format.indexOf(delimiter) !== -1;
    });
    var dateDelimiter = options.strictMode ? formatDelimiter : options.delimiters.find(function (delimiter) {
      return input.indexOf(delimiter) !== -1;
    });
    var dateAndFormat = zip(input.split(dateDelimiter), options.format.toLowerCase().split(formatDelimiter));
    var dateObj = {};
    var _iterator = _createForOfIteratorHelper(dateAndFormat),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          dateWord = _step$value[0],
          formatWord = _step$value[1];
        if (dateWord.length !== formatWord.length) {
          return false;
        }
        dateObj[formatWord.charAt(0)] = dateWord;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var fullYear = dateObj.y;

    // Check if the year starts with a hyphen
    if (fullYear.startsWith('-')) {
      return false; // Hyphen before year is not allowed
    }
    if (dateObj.y.length === 2) {
      var parsedYear = parseInt(dateObj.y, 10);
      if (isNaN(parsedYear)) {
        return false;
      }
      var currentYearLastTwoDigits = new Date().getFullYear() % 100;
      if (parsedYear < currentYearLastTwoDigits) {
        fullYear = "20".concat(dateObj.y);
      } else {
        fullYear = "19".concat(dateObj.y);
      }
    }
    var month = dateObj.m;
    if (dateObj.m.length === 1) {
      month = "0".concat(dateObj.m);
    }
    var day = dateObj.d;
    if (dateObj.d.length === 1) {
      day = "0".concat(dateObj.d);
    }
    return new Date("".concat(fullYear, "-").concat(month, "-").concat(day, "T00:00:00.000Z")).getUTCDate() === +dateObj.d;
  }
  if (!options.strictMode) {
    return Object.prototype.toString.call(input) === '[object Date]' && isFinite(input);
  }
  return false;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDecimal.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDecimal.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isDecimal;
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _includes = _interopRequireDefault(__webpack_require__(/*! ./util/includes */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/includes.js"));
var _alpha = __webpack_require__(/*! ./alpha */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/alpha.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function decimalRegExp(options) {
  var regExp = new RegExp("^[-+]?([0-9]+)?(\\".concat(_alpha.decimal[options.locale], "[0-9]{").concat(options.decimal_digits, "})").concat(options.force_decimal ? '' : '?', "$"));
  return regExp;
}
var default_decimal_options = {
  force_decimal: false,
  decimal_digits: '1,',
  locale: 'en-US'
};
var blacklist = ['', '-', '+'];
function isDecimal(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_decimal_options);
  if (options.locale in _alpha.decimal) {
    return !(0, _includes.default)(blacklist, str.replace(/ /g, '')) && decimalRegExp(options).test(str);
  }
  throw new Error("Invalid locale '".concat(options.locale, "'"));
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDivisibleBy.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDivisibleBy.js ***!
  \******************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isDivisibleBy;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _toFloat = _interopRequireDefault(__webpack_require__(/*! ./toFloat */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toFloat.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isDivisibleBy(str, num) {
  (0, _assertString.default)(str);
  return (0, _toFloat.default)(str) % parseInt(num, 10) === 0;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEAN.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEAN.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isEAN;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * The most commonly used EAN standard is
 * the thirteen-digit EAN-13, while the
 * less commonly used 8-digit EAN-8 barcode was
 * introduced for use on small packages.
 * Also EAN/UCC-14 is used for Grouping of individual
 * trade items above unit level(Intermediate, Carton or Pallet).
 * For more info about EAN-14 checkout: https://www.gtin.info/itf-14-barcodes/
 * EAN consists of:
 * GS1 prefix, manufacturer code, product code and check digit
 * Reference: https://en.wikipedia.org/wiki/International_Article_Number
 * Reference: https://www.gtin.info/
 */

/**
 * Define EAN Lenghts; 8 for EAN-8; 13 for EAN-13; 14 for EAN-14
 * and Regular Expression for valid EANs (EAN-8, EAN-13, EAN-14),
 * with exact numberic matching of 8 or 13 or 14 digits [0-9]
 */
var LENGTH_EAN_8 = 8;
var LENGTH_EAN_14 = 14;
var validEanRegex = /^(\d{8}|\d{13}|\d{14})$/;

/**
 * Get position weight given:
 * EAN length and digit index/position
 *
 * @param {number} length
 * @param {number} index
 * @return {number}
 */
function getPositionWeightThroughLengthAndIndex(length, index) {
  if (length === LENGTH_EAN_8 || length === LENGTH_EAN_14) {
    return index % 2 === 0 ? 3 : 1;
  }
  return index % 2 === 0 ? 1 : 3;
}

/**
 * Calculate EAN Check Digit
 * Reference: https://en.wikipedia.org/wiki/International_Article_Number#Calculation_of_checksum_digit
 *
 * @param {string} ean
 * @return {number}
 */
function calculateCheckDigit(ean) {
  var checksum = ean.slice(0, -1).split('').map(function (char, index) {
    return Number(char) * getPositionWeightThroughLengthAndIndex(ean.length, index);
  }).reduce(function (acc, partialSum) {
    return acc + partialSum;
  }, 0);
  var remainder = 10 - checksum % 10;
  return remainder < 10 ? remainder : 0;
}

/**
 * Check if string is valid EAN:
 * Matches EAN-8/EAN-13/EAN-14 regex
 * Has valid check digit.
 *
 * @param {string} str
 * @return {boolean}
 */
function isEAN(str) {
  (0, _assertString.default)(str);
  var actualCheckDigit = Number(str.slice(-1));
  return validEanRegex.test(str) && actualCheckDigit === calculateCheckDigit(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEmail.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEmail.js ***!
  \************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isEmail;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _isByteLength = _interopRequireDefault(__webpack_require__(/*! ./isByteLength */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isByteLength.js"));
var _isFQDN = _interopRequireDefault(__webpack_require__(/*! ./isFQDN */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFQDN.js"));
var _isIP = _interopRequireDefault(__webpack_require__(/*! ./isIP */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIP.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var default_email_options = {
  allow_display_name: false,
  allow_underscores: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
  blacklisted_chars: '',
  ignore_max_length: false,
  host_blacklist: [],
  host_whitelist: []
};

/* eslint-disable max-len */
/* eslint-disable no-control-regex */
var splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i;
var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
var gmailUserPart = /^[a-z\d]+$/;
var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
var defaultMaxEmailLength = 254;
/* eslint-enable max-len */
/* eslint-enable no-control-regex */

/**
 * Validate display name according to the RFC2822: https://tools.ietf.org/html/rfc2822#appendix-A.1.2
 * @param {String} display_name
 */
function validateDisplayName(display_name) {
  var display_name_without_quotes = display_name.replace(/^"(.+)"$/, '$1');
  // display name with only spaces is not valid
  if (!display_name_without_quotes.trim()) {
    return false;
  }

  // check whether display name contains illegal character
  var contains_illegal = /[\.";<>]/.test(display_name_without_quotes);
  if (contains_illegal) {
    // if contains illegal characters,
    // must to be enclosed in double-quotes, otherwise it's not a valid display name
    if (display_name_without_quotes === display_name) {
      return false;
    }

    // the quotes in display name must start with character symbol \
    var all_start_with_back_slash = display_name_without_quotes.split('"').length === display_name_without_quotes.split('\\"').length;
    if (!all_start_with_back_slash) {
      return false;
    }
  }
  return true;
}
function isEmail(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_email_options);
  if (options.require_display_name || options.allow_display_name) {
    var display_email = str.match(splitNameAddress);
    if (display_email) {
      var display_name = display_email[1];

      // Remove display name and angle brackets to get email address
      // Can be done in the regex but will introduce a ReDOS (See  #1597 for more info)
      str = str.replace(display_name, '').replace(/(^<|>$)/g, '');

      // sometimes need to trim the last space to get the display name
      // because there may be a space between display name and email address
      // eg. myname <address@gmail.com>
      // the display name is `myname` instead of `myname `, so need to trim the last space
      if (display_name.endsWith(' ')) {
        display_name = display_name.slice(0, -1);
      }
      if (!validateDisplayName(display_name)) {
        return false;
      }
    } else if (options.require_display_name) {
      return false;
    }
  }
  if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
    return false;
  }
  var parts = str.split('@');
  var domain = parts.pop();
  var lower_domain = domain.toLowerCase();
  if (options.host_blacklist.includes(lower_domain)) {
    return false;
  }
  if (options.host_whitelist.length > 0 && !options.host_whitelist.includes(lower_domain)) {
    return false;
  }
  var user = parts.join('@');
  if (options.domain_specific_validation && (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com')) {
    /*
      Previously we removed dots for gmail addresses before validating.
      This was removed because it allows `multiple..dots@gmail.com`
      to be reported as valid, but it is not.
      Gmail only normalizes single dots, removing them from here is pointless,
      should be done in normalizeEmail
    */
    user = user.toLowerCase();

    // Removing sub-address from username before gmail validation
    var username = user.split('+')[0];

    // Dots are not included in gmail length restriction
    if (!(0, _isByteLength.default)(username.replace(/\./g, ''), {
      min: 6,
      max: 30
    })) {
      return false;
    }
    var _user_parts = username.split('.');
    for (var i = 0; i < _user_parts.length; i++) {
      if (!gmailUserPart.test(_user_parts[i])) {
        return false;
      }
    }
  }
  if (options.ignore_max_length === false && (!(0, _isByteLength.default)(user, {
    max: 64
  }) || !(0, _isByteLength.default)(domain, {
    max: 254
  }))) {
    return false;
  }
  if (!(0, _isFQDN.default)(domain, {
    require_tld: options.require_tld,
    ignore_max_length: options.ignore_max_length,
    allow_underscores: options.allow_underscores
  })) {
    if (!options.allow_ip_domain) {
      return false;
    }
    if (!(0, _isIP.default)(domain)) {
      if (!domain.startsWith('[') || !domain.endsWith(']')) {
        return false;
      }
      var noBracketdomain = domain.slice(1, -1);
      if (noBracketdomain.length === 0 || !(0, _isIP.default)(noBracketdomain)) {
        return false;
      }
    }
  }
  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }
  var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
  var user_parts = user.split('.');
  for (var _i = 0; _i < user_parts.length; _i++) {
    if (!pattern.test(user_parts[_i])) {
      return false;
    }
  }
  if (options.blacklisted_chars) {
    if (user.search(new RegExp("[".concat(options.blacklisted_chars, "]+"), 'g')) !== -1) return false;
  }
  return true;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEmpty.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEmpty.js ***!
  \************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isEmpty;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var default_is_empty_options = {
  ignore_whitespace: false
};
function isEmpty(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_is_empty_options);
  return (options.ignore_whitespace ? str.trim().length : str.length) === 0;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEthereumAddress.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEthereumAddress.js ***!
  \**********************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isEthereumAddress;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var eth = /^(0x)[0-9a-f]{40}$/i;
function isEthereumAddress(str) {
  (0, _assertString.default)(str);
  return eth.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFQDN.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFQDN.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isFQDN;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_numeric_tld: false,
  allow_wildcard: false,
  ignore_max_length: false
};
function isFQDN(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, default_fqdn_options);

  /* Remove the optional trailing dot before checking validity */
  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }

  /* Remove the optional wildcard before checking validity */
  if (options.allow_wildcard === true && str.indexOf('*.') === 0) {
    str = str.substring(2);
  }
  var parts = str.split('.');
  var tld = parts[parts.length - 1];
  if (options.require_tld) {
    // disallow fqdns without tld
    if (parts.length < 2) {
      return false;
    }
    if (!options.allow_numeric_tld && !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    }

    // disallow spaces
    if (/\s/.test(tld)) {
      return false;
    }
  }

  // reject numeric TLDs
  if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
    return false;
  }
  return parts.every(function (part) {
    if (part.length > 63 && !options.ignore_max_length) {
      return false;
    }
    if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }

    // disallow full-width chars
    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    }

    // disallow parts starting or ending with hyphen
    if (/^-|-$/.test(part)) {
      return false;
    }
    if (!options.allow_underscores && /_/.test(part)) {
      return false;
    }
    return true;
  });
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFloat.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFloat.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isFloat;
exports.locales = void 0;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _alpha = __webpack_require__(/*! ./alpha */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/alpha.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isFloat(str, options) {
  (0, _assertString.default)(str);
  options = options || {};
  var float = new RegExp("^(?:[-+])?(?:[0-9]+)?(?:\\".concat(options.locale ? _alpha.decimal[options.locale] : '.', "[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$"));
  if (str === '' || str === '.' || str === ',' || str === '-' || str === '+') {
    return false;
  }
  var value = parseFloat(str.replace(',', '.'));
  return float.test(str) && (!options.hasOwnProperty('min') || value >= options.min) && (!options.hasOwnProperty('max') || value <= options.max) && (!options.hasOwnProperty('lt') || value < options.lt) && (!options.hasOwnProperty('gt') || value > options.gt);
}
var locales = exports.locales = Object.keys(_alpha.decimal);

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFullWidth.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFullWidth.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isFullWidth;
exports.fullWidth = void 0;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var fullWidth = exports.fullWidth = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
function isFullWidth(str) {
  (0, _assertString.default)(str);
  return fullWidth.test(str);
}

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHSL.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHSL.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isHSL;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var hslComma = /^hsla?\(((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn)?(,(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}(,((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?))?\)$/i;
var hslSpace = /^hsla?\(((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?))(deg|grad|rad|turn)?(\s(\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%){2}\s?(\/\s((\+|\-)?([0-9]+(\.[0-9]+)?(e(\+|\-)?[0-9]+)?|\.[0-9]+(e(\+|\-)?[0-9]+)?)%?)\s?)?\)$/i;
function isHSL(str) {
  (0, _assertString.default)(str);

  // Strip duplicate spaces before calling the validation regex (See  #1598 for more info)
  var strippedStr = str.replace(/\s+/g, ' ').replace(/\s?(hsla?\(|\)|,)\s?/ig, '$1');
  if (strippedStr.indexOf(',') !== -1) {
    return hslComma.test(strippedStr);
  }
  return hslSpace.test(strippedStr);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHalfWidth.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHalfWidth.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isHalfWidth;
exports.halfWidth = void 0;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var halfWidth = exports.halfWidth = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE0-9a-zA-Z]/;
function isHalfWidth(str) {
  (0, _assertString.default)(str);
  return halfWidth.test(str);
}

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHash.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHash.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isHash;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var lengths = {
  md5: 32,
  md4: 32,
  sha1: 40,
  sha256: 64,
  sha384: 96,
  sha512: 128,
  ripemd128: 32,
  ripemd160: 40,
  tiger128: 32,
  tiger160: 40,
  tiger192: 48,
  crc32: 8,
  crc32b: 8
};
function isHash(str, algorithm) {
  (0, _assertString.default)(str);
  var hash = new RegExp("^[a-fA-F0-9]{".concat(lengths[algorithm], "}$"));
  return hash.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHexColor.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHexColor.js ***!
  \***************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isHexColor;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
function isHexColor(str) {
  (0, _assertString.default)(str);
  return hexcolor.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHexadecimal.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHexadecimal.js ***!
  \******************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isHexadecimal;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var hexadecimal = /^(0x|0h)?[0-9A-F]+$/i;
function isHexadecimal(str) {
  (0, _assertString.default)(str);
  return hexadecimal.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIBAN.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIBAN.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isIBAN;
exports.locales = void 0;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * List of country codes with
 * corresponding IBAN regular expression
 * Reference: https://en.wikipedia.org/wiki/International_Bank_Account_Number
 */
var ibanRegexThroughCountryCode = {
  AD: /^(AD[0-9]{2})\d{8}[A-Z0-9]{12}$/,
  AE: /^(AE[0-9]{2})\d{3}\d{16}$/,
  AL: /^(AL[0-9]{2})\d{8}[A-Z0-9]{16}$/,
  AT: /^(AT[0-9]{2})\d{16}$/,
  AZ: /^(AZ[0-9]{2})[A-Z0-9]{4}\d{20}$/,
  BA: /^(BA[0-9]{2})\d{16}$/,
  BE: /^(BE[0-9]{2})\d{12}$/,
  BG: /^(BG[0-9]{2})[A-Z]{4}\d{6}[A-Z0-9]{8}$/,
  BH: /^(BH[0-9]{2})[A-Z]{4}[A-Z0-9]{14}$/,
  BR: /^(BR[0-9]{2})\d{23}[A-Z]{1}[A-Z0-9]{1}$/,
  BY: /^(BY[0-9]{2})[A-Z0-9]{4}\d{20}$/,
  CH: /^(CH[0-9]{2})\d{5}[A-Z0-9]{12}$/,
  CR: /^(CR[0-9]{2})\d{18}$/,
  CY: /^(CY[0-9]{2})\d{8}[A-Z0-9]{16}$/,
  CZ: /^(CZ[0-9]{2})\d{20}$/,
  DE: /^(DE[0-9]{2})\d{18}$/,
  DK: /^(DK[0-9]{2})\d{14}$/,
  DO: /^(DO[0-9]{2})[A-Z]{4}\d{20}$/,
  DZ: /^(DZ\d{24})$/,
  EE: /^(EE[0-9]{2})\d{16}$/,
  EG: /^(EG[0-9]{2})\d{25}$/,
  ES: /^(ES[0-9]{2})\d{20}$/,
  FI: /^(FI[0-9]{2})\d{14}$/,
  FO: /^(FO[0-9]{2})\d{14}$/,
  FR: /^(FR[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  GB: /^(GB[0-9]{2})[A-Z]{4}\d{14}$/,
  GE: /^(GE[0-9]{2})[A-Z0-9]{2}\d{16}$/,
  GI: /^(GI[0-9]{2})[A-Z]{4}[A-Z0-9]{15}$/,
  GL: /^(GL[0-9]{2})\d{14}$/,
  GR: /^(GR[0-9]{2})\d{7}[A-Z0-9]{16}$/,
  GT: /^(GT[0-9]{2})[A-Z0-9]{4}[A-Z0-9]{20}$/,
  HR: /^(HR[0-9]{2})\d{17}$/,
  HU: /^(HU[0-9]{2})\d{24}$/,
  IE: /^(IE[0-9]{2})[A-Z0-9]{4}\d{14}$/,
  IL: /^(IL[0-9]{2})\d{19}$/,
  IQ: /^(IQ[0-9]{2})[A-Z]{4}\d{15}$/,
  IR: /^(IR[0-9]{2})0\d{2}0\d{18}$/,
  IS: /^(IS[0-9]{2})\d{22}$/,
  IT: /^(IT[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
  JO: /^(JO[0-9]{2})[A-Z]{4}\d{22}$/,
  KW: /^(KW[0-9]{2})[A-Z]{4}[A-Z0-9]{22}$/,
  KZ: /^(KZ[0-9]{2})\d{3}[A-Z0-9]{13}$/,
  LB: /^(LB[0-9]{2})\d{4}[A-Z0-9]{20}$/,
  LC: /^(LC[0-9]{2})[A-Z]{4}[A-Z0-9]{24}$/,
  LI: /^(LI[0-9]{2})\d{5}[A-Z0-9]{12}$/,
  LT: /^(LT[0-9]{2})\d{16}$/,
  LU: /^(LU[0-9]{2})\d{3}[A-Z0-9]{13}$/,
  LV: /^(LV[0-9]{2})[A-Z]{4}[A-Z0-9]{13}$/,
  MA: /^(MA[0-9]{26})$/,
  MC: /^(MC[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  MD: /^(MD[0-9]{2})[A-Z0-9]{20}$/,
  ME: /^(ME[0-9]{2})\d{18}$/,
  MK: /^(MK[0-9]{2})\d{3}[A-Z0-9]{10}\d{2}$/,
  MR: /^(MR[0-9]{2})\d{23}$/,
  MT: /^(MT[0-9]{2})[A-Z]{4}\d{5}[A-Z0-9]{18}$/,
  MU: /^(MU[0-9]{2})[A-Z]{4}\d{19}[A-Z]{3}$/,
  MZ: /^(MZ[0-9]{2})\d{21}$/,
  NL: /^(NL[0-9]{2})[A-Z]{4}\d{10}$/,
  NO: /^(NO[0-9]{2})\d{11}$/,
  PK: /^(PK[0-9]{2})[A-Z0-9]{4}\d{16}$/,
  PL: /^(PL[0-9]{2})\d{24}$/,
  PS: /^(PS[0-9]{2})[A-Z0-9]{4}\d{21}$/,
  PT: /^(PT[0-9]{2})\d{21}$/,
  QA: /^(QA[0-9]{2})[A-Z]{4}[A-Z0-9]{21}$/,
  RO: /^(RO[0-9]{2})[A-Z]{4}[A-Z0-9]{16}$/,
  RS: /^(RS[0-9]{2})\d{18}$/,
  SA: /^(SA[0-9]{2})\d{2}[A-Z0-9]{18}$/,
  SC: /^(SC[0-9]{2})[A-Z]{4}\d{20}[A-Z]{3}$/,
  SE: /^(SE[0-9]{2})\d{20}$/,
  SI: /^(SI[0-9]{2})\d{15}$/,
  SK: /^(SK[0-9]{2})\d{20}$/,
  SM: /^(SM[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
  SV: /^(SV[0-9]{2})[A-Z0-9]{4}\d{20}$/,
  TL: /^(TL[0-9]{2})\d{19}$/,
  TN: /^(TN[0-9]{2})\d{20}$/,
  TR: /^(TR[0-9]{2})\d{5}[A-Z0-9]{17}$/,
  UA: /^(UA[0-9]{2})\d{6}[A-Z0-9]{19}$/,
  VA: /^(VA[0-9]{2})\d{18}$/,
  VG: /^(VG[0-9]{2})[A-Z0-9]{4}\d{16}$/,
  XK: /^(XK[0-9]{2})\d{16}$/
};

/**
 * Check if the country codes passed are valid using the
 * ibanRegexThroughCountryCode as a reference
 *
 * @param {array} countryCodeArray
 * @return {boolean}
 */

function hasOnlyValidCountryCodes(countryCodeArray) {
  var countryCodeArrayFilteredWithObjectIbanCode = countryCodeArray.filter(function (countryCode) {
    return !(countryCode in ibanRegexThroughCountryCode);
  });
  if (countryCodeArrayFilteredWithObjectIbanCode.length > 0) {
    return false;
  }
  return true;
}

/**
 * Check whether string has correct universal IBAN format
 * The IBAN consists of up to 34 alphanumeric characters, as follows:
 * Country Code using ISO 3166-1 alpha-2, two letters
 * check digits, two digits and
 * Basic Bank Account Number (BBAN), up to 30 alphanumeric characters.
 * NOTE: Permitted IBAN characters are: digits [0-9] and the 26 latin alphabetic [A-Z]
 *
 * @param {string} str - string under validation
 * @param {object} options - object to pass the countries to be either whitelisted or blacklisted
 * @return {boolean}
 */
function hasValidIbanFormat(str, options) {
  // Strip white spaces and hyphens
  var strippedStr = str.replace(/[\s\-]+/gi, '').toUpperCase();
  var isoCountryCode = strippedStr.slice(0, 2).toUpperCase();
  var isoCountryCodeInIbanRegexCodeObject = (isoCountryCode in ibanRegexThroughCountryCode);
  if (options.whitelist) {
    if (!hasOnlyValidCountryCodes(options.whitelist)) {
      return false;
    }
    var isoCountryCodeInWhiteList = options.whitelist.includes(isoCountryCode);
    if (!isoCountryCodeInWhiteList) {
      return false;
    }
  }
  if (options.blacklist) {
    var isoCountryCodeInBlackList = options.blacklist.includes(isoCountryCode);
    if (isoCountryCodeInBlackList) {
      return false;
    }
  }
  return isoCountryCodeInIbanRegexCodeObject && ibanRegexThroughCountryCode[isoCountryCode].test(strippedStr);
}

/**
   * Check whether string has valid IBAN Checksum
   * by performing basic mod-97 operation and
   * the remainder should equal 1
   * -- Start by rearranging the IBAN by moving the four initial characters to the end of the string
   * -- Replace each letter in the string with two digits, A -> 10, B = 11, Z = 35
   * -- Interpret the string as a decimal integer and
   * -- compute the remainder on division by 97 (mod 97)
   * Reference: https://en.wikipedia.org/wiki/International_Bank_Account_Number
   *
   * @param {string} str
   * @return {boolean}
   */
function hasValidIbanChecksum(str) {
  var strippedStr = str.replace(/[^A-Z0-9]+/gi, '').toUpperCase(); // Keep only digits and A-Z latin alphabetic
  var rearranged = strippedStr.slice(4) + strippedStr.slice(0, 4);
  var alphaCapsReplacedWithDigits = rearranged.replace(/[A-Z]/g, function (char) {
    return char.charCodeAt(0) - 55;
  });
  var remainder = alphaCapsReplacedWithDigits.match(/\d{1,7}/g).reduce(function (acc, value) {
    return Number(acc + value) % 97;
  }, '');
  return remainder === 1;
}
function isIBAN(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _assertString.default)(str);
  return hasValidIbanFormat(str, options) && hasValidIbanChecksum(str);
}
var locales = exports.locales = Object.keys(ibanRegexThroughCountryCode);

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIMEI.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIMEI.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isIMEI;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var imeiRegexWithoutHypens = /^[0-9]{15}$/;
var imeiRegexWithHypens = /^\d{2}-\d{6}-\d{6}-\d{1}$/;
function isIMEI(str, options) {
  (0, _assertString.default)(str);
  options = options || {};

  // default regex for checking imei is the one without hyphens

  var imeiRegex = imeiRegexWithoutHypens;
  if (options.allow_hyphens) {
    imeiRegex = imeiRegexWithHypens;
  }
  if (!imeiRegex.test(str)) {
    return false;
  }
  str = str.replace(/-/g, '');
  var sum = 0,
    mul = 2,
    l = 14;
  for (var i = 0; i < l; i++) {
    var digit = str.substring(l - i - 1, l - i);
    var tp = parseInt(digit, 10) * mul;
    if (tp >= 10) {
      sum += tp % 10 + 1;
    } else {
      sum += tp;
    }
    if (mul === 1) {
      mul += 1;
    } else {
      mul -= 1;
    }
  }
  var chk = (10 - sum % 10) % 10;
  if (chk !== parseInt(str.substring(14, 15), 10)) {
    return false;
  }
  return true;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIP.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIP.js ***!
  \*********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isIP;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
11.3.  Examples

   The following addresses

             fe80::1234 (on the 1st link of the node)
             ff02::5678 (on the 5th link of the node)
             ff08::9abc (on the 10th organization of the node)

   would be represented as follows:

             fe80::1234%1
             ff02::5678%5
             ff08::9abc%10

   (Here we assume a natural translation from a zone index to the
   <zone_id> part, where the Nth zone of any scope is translated into
   "N".)

   If we use interface names as <zone_id>, those addresses could also be
   represented as follows:

            fe80::1234%ne0
            ff02::5678%pvc1.3
            ff08::9abc%interface10

   where the interface "ne0" belongs to the 1st link, "pvc1.3" belongs
   to the 5th link, and "interface10" belongs to the 10th organization.
 * * */
var IPv4SegmentFormat = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])';
var IPv4AddressFormat = "(".concat(IPv4SegmentFormat, "[.]){3}").concat(IPv4SegmentFormat);
var IPv4AddressRegExp = new RegExp("^".concat(IPv4AddressFormat, "$"));
var IPv6SegmentFormat = '(?:[0-9a-fA-F]{1,4})';
var IPv6AddressRegExp = new RegExp('^(' + "(?:".concat(IPv6SegmentFormat, ":){7}(?:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){6}(?:").concat(IPv4AddressFormat, "|:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){5}(?::").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,2}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){4}(?:(:").concat(IPv6SegmentFormat, "){0,1}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,3}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){3}(?:(:").concat(IPv6SegmentFormat, "){0,2}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,4}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){2}(?:(:").concat(IPv6SegmentFormat, "){0,3}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,5}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){1}(?:(:").concat(IPv6SegmentFormat, "){0,4}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,6}|:)|") + "(?::((?::".concat(IPv6SegmentFormat, "){0,5}:").concat(IPv4AddressFormat, "|(?::").concat(IPv6SegmentFormat, "){1,7}|:))") + ')(%[0-9a-zA-Z-.:]{1,})?$');
function isIP(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  (0, _assertString.default)(str);
  version = String(version);
  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  }
  if (version === '4') {
    return IPv4AddressRegExp.test(str);
  }
  if (version === '6') {
    return IPv6AddressRegExp.test(str);
  }
  return false;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIPRange.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIPRange.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isIPRange;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _isIP = _interopRequireDefault(__webpack_require__(/*! ./isIP */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIP.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var subnetMaybe = /^\d{1,3}$/;
var v4Subnet = 32;
var v6Subnet = 128;
function isIPRange(str) {
  var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  (0, _assertString.default)(str);
  var parts = str.split('/');

  // parts[0] -> ip, parts[1] -> subnet
  if (parts.length !== 2) {
    return false;
  }
  if (!subnetMaybe.test(parts[1])) {
    return false;
  }

  // Disallow preceding 0 i.e. 01, 02, ...
  if (parts[1].length > 1 && parts[1].startsWith('0')) {
    return false;
  }
  var isValidIP = (0, _isIP.default)(parts[0], version);
  if (!isValidIP) {
    return false;
  }

  // Define valid subnet according to IP's version
  var expectedSubnet = null;
  switch (String(version)) {
    case '4':
      expectedSubnet = v4Subnet;
      break;
    case '6':
      expectedSubnet = v6Subnet;
      break;
    default:
      expectedSubnet = (0, _isIP.default)(parts[0], '6') ? v6Subnet : v4Subnet;
  }
  return parts[1] <= expectedSubnet && parts[1] >= 0;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISBN.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISBN.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isISBN;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var possibleIsbn10 = /^(?:[0-9]{9}X|[0-9]{10})$/;
var possibleIsbn13 = /^(?:[0-9]{13})$/;
var factor = [1, 3];
function isISBN(isbn, options) {
  (0, _assertString.default)(isbn);

  // For backwards compatibility:
  // isISBN(str [, version]), i.e. `options` could be used as argument for the legacy `version`
  var version = String((options === null || options === void 0 ? void 0 : options.version) || options);
  if (!(options !== null && options !== void 0 && options.version || options)) {
    return isISBN(isbn, {
      version: 10
    }) || isISBN(isbn, {
      version: 13
    });
  }
  var sanitizedIsbn = isbn.replace(/[\s-]+/g, '');
  var checksum = 0;
  if (version === '10') {
    if (!possibleIsbn10.test(sanitizedIsbn)) {
      return false;
    }
    for (var i = 0; i < version - 1; i++) {
      checksum += (i + 1) * sanitizedIsbn.charAt(i);
    }
    if (sanitizedIsbn.charAt(9) === 'X') {
      checksum += 10 * 10;
    } else {
      checksum += 10 * sanitizedIsbn.charAt(9);
    }
    if (checksum % 11 === 0) {
      return true;
    }
  } else if (version === '13') {
    if (!possibleIsbn13.test(sanitizedIsbn)) {
      return false;
    }
    for (var _i = 0; _i < 12; _i++) {
      checksum += factor[_i % 2] * sanitizedIsbn.charAt(_i);
    }
    if (sanitizedIsbn.charAt(12) - (10 - checksum % 10) % 10 === 0) {
      return true;
    }
  }
  return false;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISIN.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISIN.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isISIN;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var isin = /^[A-Z]{2}[0-9A-Z]{9}[0-9]$/;

// this link details how the check digit is calculated:
// https://www.isin.org/isin-format/. it is a little bit
// odd in that it works with digits, not numbers. in order
// to make only one pass through the ISIN characters, the
// each alpha character is handled as 2 characters within
// the loop.

function isISIN(str) {
  (0, _assertString.default)(str);
  if (!isin.test(str)) {
    return false;
  }
  var double = true;
  var sum = 0;
  // convert values
  for (var i = str.length - 2; i >= 0; i--) {
    if (str[i] >= 'A' && str[i] <= 'Z') {
      var value = str[i].charCodeAt(0) - 55;
      var lo = value % 10;
      var hi = Math.trunc(value / 10);
      // letters have two digits, so handle the low order
      // and high order digits separately.
      for (var _i = 0, _arr = [lo, hi]; _i < _arr.length; _i++) {
        var digit = _arr[_i];
        if (double) {
          if (digit >= 5) {
            sum += 1 + (digit - 5) * 2;
          } else {
            sum += digit * 2;
          }
        } else {
          sum += digit;
        }
        double = !double;
      }
    } else {
      var _digit = str[i].charCodeAt(0) - '0'.charCodeAt(0);
      if (double) {
        if (_digit >= 5) {
          sum += 1 + (_digit - 5) * 2;
        } else {
          sum += _digit * 2;
        }
      } else {
        sum += _digit;
      }
      double = !double;
    }
  }
  var check = Math.trunc((sum + 9) / 10) * 10 - sum;
  return +str[str.length - 1] === check;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO31661Alpha2.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO31661Alpha2.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CountryCodes = void 0;
exports["default"] = isISO31661Alpha2;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
var validISO31661Alpha2CountriesCodes = new Set(['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW']);
function isISO31661Alpha2(str) {
  (0, _assertString.default)(str);
  return validISO31661Alpha2CountriesCodes.has(str.toUpperCase());
}
var CountryCodes = exports.CountryCodes = validISO31661Alpha2CountriesCodes;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO31661Alpha3.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO31661Alpha3.js ***!
  \*********************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isISO31661Alpha3;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// from https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
var validISO31661Alpha3CountriesCodes = new Set(['AFG', 'ALA', 'ALB', 'DZA', 'ASM', 'AND', 'AGO', 'AIA', 'ATA', 'ATG', 'ARG', 'ARM', 'ABW', 'AUS', 'AUT', 'AZE', 'BHS', 'BHR', 'BGD', 'BRB', 'BLR', 'BEL', 'BLZ', 'BEN', 'BMU', 'BTN', 'BOL', 'BES', 'BIH', 'BWA', 'BVT', 'BRA', 'IOT', 'BRN', 'BGR', 'BFA', 'BDI', 'KHM', 'CMR', 'CAN', 'CPV', 'CYM', 'CAF', 'TCD', 'CHL', 'CHN', 'CXR', 'CCK', 'COL', 'COM', 'COG', 'COD', 'COK', 'CRI', 'CIV', 'HRV', 'CUB', 'CUW', 'CYP', 'CZE', 'DNK', 'DJI', 'DMA', 'DOM', 'ECU', 'EGY', 'SLV', 'GNQ', 'ERI', 'EST', 'ETH', 'FLK', 'FRO', 'FJI', 'FIN', 'FRA', 'GUF', 'PYF', 'ATF', 'GAB', 'GMB', 'GEO', 'DEU', 'GHA', 'GIB', 'GRC', 'GRL', 'GRD', 'GLP', 'GUM', 'GTM', 'GGY', 'GIN', 'GNB', 'GUY', 'HTI', 'HMD', 'VAT', 'HND', 'HKG', 'HUN', 'ISL', 'IND', 'IDN', 'IRN', 'IRQ', 'IRL', 'IMN', 'ISR', 'ITA', 'JAM', 'JPN', 'JEY', 'JOR', 'KAZ', 'KEN', 'KIR', 'PRK', 'KOR', 'KWT', 'KGZ', 'LAO', 'LVA', 'LBN', 'LSO', 'LBR', 'LBY', 'LIE', 'LTU', 'LUX', 'MAC', 'MKD', 'MDG', 'MWI', 'MYS', 'MDV', 'MLI', 'MLT', 'MHL', 'MTQ', 'MRT', 'MUS', 'MYT', 'MEX', 'FSM', 'MDA', 'MCO', 'MNG', 'MNE', 'MSR', 'MAR', 'MOZ', 'MMR', 'NAM', 'NRU', 'NPL', 'NLD', 'NCL', 'NZL', 'NIC', 'NER', 'NGA', 'NIU', 'NFK', 'MNP', 'NOR', 'OMN', 'PAK', 'PLW', 'PSE', 'PAN', 'PNG', 'PRY', 'PER', 'PHL', 'PCN', 'POL', 'PRT', 'PRI', 'QAT', 'REU', 'ROU', 'RUS', 'RWA', 'BLM', 'SHN', 'KNA', 'LCA', 'MAF', 'SPM', 'VCT', 'WSM', 'SMR', 'STP', 'SAU', 'SEN', 'SRB', 'SYC', 'SLE', 'SGP', 'SXM', 'SVK', 'SVN', 'SLB', 'SOM', 'ZAF', 'SGS', 'SSD', 'ESP', 'LKA', 'SDN', 'SUR', 'SJM', 'SWZ', 'SWE', 'CHE', 'SYR', 'TWN', 'TJK', 'TZA', 'THA', 'TLS', 'TGO', 'TKL', 'TON', 'TTO', 'TUN', 'TUR', 'TKM', 'TCA', 'TUV', 'UGA', 'UKR', 'ARE', 'GBR', 'USA', 'UMI', 'URY', 'UZB', 'VUT', 'VEN', 'VNM', 'VGB', 'VIR', 'WLF', 'ESH', 'YEM', 'ZMB', 'ZWE']);
function isISO31661Alpha3(str) {
  (0, _assertString.default)(str);
  return validISO31661Alpha3CountriesCodes.has(str.toUpperCase());
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO4217.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO4217.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CurrencyCodes = void 0;
exports["default"] = isISO4217;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// from https://en.wikipedia.org/wiki/ISO_4217
var validISO4217CurrencyCodes = new Set(['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'USN', 'UYI', 'UYU', 'UYW', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'XSU', 'XTS', 'XUA', 'XXX', 'YER', 'ZAR', 'ZMW', 'ZWL']);
function isISO4217(str) {
  (0, _assertString.default)(str);
  return validISO4217CurrencyCodes.has(str.toUpperCase());
}
var CurrencyCodes = exports.CurrencyCodes = validISO4217CurrencyCodes;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO6346.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO6346.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.isFreightContainerID = void 0;
exports.isISO6346 = isISO6346;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// https://en.wikipedia.org/wiki/ISO_6346
// according to ISO6346 standard, checksum digit is mandatory for freight container but recommended
// for other container types (J and Z)
var isISO6346Str = /^[A-Z]{3}(U[0-9]{7})|([J,Z][0-9]{6,7})$/;
var isDigit = /^[0-9]$/;
function isISO6346(str) {
  (0, _assertString.default)(str);
  str = str.toUpperCase();
  if (!isISO6346Str.test(str)) return false;
  if (str.length === 11) {
    var sum = 0;
    for (var i = 0; i < str.length - 1; i++) {
      if (!isDigit.test(str[i])) {
        var convertedCode = void 0;
        var letterCode = str.charCodeAt(i) - 55;
        if (letterCode < 11) convertedCode = letterCode;else if (letterCode >= 11 && letterCode <= 20) convertedCode = 12 + letterCode % 11;else if (letterCode >= 21 && letterCode <= 30) convertedCode = 23 + letterCode % 21;else convertedCode = 34 + letterCode % 31;
        sum += convertedCode * Math.pow(2, i);
      } else sum += str[i] * Math.pow(2, i);
    }
    var checkSumDigit = sum % 11;
    return Number(str[str.length - 1]) === checkSumDigit;
  }
  return true;
}
var isFreightContainerID = exports.isFreightContainerID = isISO6346;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO6391.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO6391.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isISO6391;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var isISO6391Set = new Set(['aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu']);
function isISO6391(str) {
  (0, _assertString.default)(str);
  return isISO6391Set.has(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO8601.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISO8601.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isISO8601;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-len */
// from http://goo.gl/0ejHHW
var iso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
// same as above, except with a strict 'T' separator between date and time
var iso8601StrictSeparator = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
/* eslint-enable max-len */
var isValidDate = function isValidDate(str) {
  // str must have passed the ISO8601 check
  // this check is meant to catch invalid dates
  // like 2009-02-31
  // first check for ordinal dates
  var ordinalMatch = str.match(/^(\d{4})-?(\d{3})([ T]{1}\.*|$)/);
  if (ordinalMatch) {
    var oYear = Number(ordinalMatch[1]);
    var oDay = Number(ordinalMatch[2]);
    // if is leap year
    if (oYear % 4 === 0 && oYear % 100 !== 0 || oYear % 400 === 0) return oDay <= 366;
    return oDay <= 365;
  }
  var match = str.match(/(\d{4})-?(\d{0,2})-?(\d*)/).map(Number);
  var year = match[1];
  var month = match[2];
  var day = match[3];
  var monthString = month ? "0".concat(month).slice(-2) : month;
  var dayString = day ? "0".concat(day).slice(-2) : day;

  // create a date object and compare
  var d = new Date("".concat(year, "-").concat(monthString || '01', "-").concat(dayString || '01'));
  if (month && day) {
    return d.getUTCFullYear() === year && d.getUTCMonth() + 1 === month && d.getUTCDate() === day;
  }
  return true;
};
function isISO8601(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _assertString.default)(str);
  var check = options.strictSeparator ? iso8601StrictSeparator.test(str) : iso8601.test(str);
  if (check && options.strict) return isValidDate(str);
  return check;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISRC.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISRC.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isISRC;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// see http://isrc.ifpi.org/en/isrc-standard/code-syntax
var isrc = /^[A-Z]{2}[0-9A-Z]{3}\d{2}\d{5}$/;
function isISRC(str) {
  (0, _assertString.default)(str);
  return isrc.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISSN.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isISSN.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isISSN;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var issn = '^\\d{4}-?\\d{3}[\\dX]$';
function isISSN(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  (0, _assertString.default)(str);
  var testIssn = issn;
  testIssn = options.require_hyphen ? testIssn.replace('?', '') : testIssn;
  testIssn = options.case_sensitive ? new RegExp(testIssn) : new RegExp(testIssn, 'i');
  if (!testIssn.test(str)) {
    return false;
  }
  var digits = str.replace('-', '').toUpperCase();
  var checksum = 0;
  for (var i = 0; i < digits.length; i++) {
    var digit = digits[i];
    checksum += (digit === 'X' ? 10 : +digit) * (8 - i);
  }
  return checksum % 11 === 0;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIdentityCard.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIdentityCard.js ***!
  \*******************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isIdentityCard;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _isInt = _interopRequireDefault(__webpack_require__(/*! ./isInt */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isInt.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var validators = {
  PL: function PL(str) {
    (0, _assertString.default)(str);
    var weightOfDigits = {
      1: 1,
      2: 3,
      3: 7,
      4: 9,
      5: 1,
      6: 3,
      7: 7,
      8: 9,
      9: 1,
      10: 3,
      11: 0
    };
    if (str != null && str.length === 11 && (0, _isInt.default)(str, {
      allow_leading_zeroes: true
    })) {
      var digits = str.split('').slice(0, -1);
      var sum = digits.reduce(function (acc, digit, index) {
        return acc + Number(digit) * weightOfDigits[index + 1];
      }, 0);
      var modulo = sum % 10;
      var lastDigit = Number(str.charAt(str.length - 1));
      if (modulo === 0 && lastDigit === 0 || lastDigit === 10 - modulo) {
        return true;
      }
    }
    return false;
  },
  ES: function ES(str) {
    (0, _assertString.default)(str);
    var DNI = /^[0-9X-Z][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    var charsValue = {
      X: 0,
      Y: 1,
      Z: 2
    };
    var controlDigits = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];

    // sanitize user input
    var sanitized = str.trim().toUpperCase();

    // validate the data structure
    if (!DNI.test(sanitized)) {
      return false;
    }

    // validate the control digit
    var number = sanitized.slice(0, -1).replace(/[X,Y,Z]/g, function (char) {
      return charsValue[char];
    });
    return sanitized.endsWith(controlDigits[number % 23]);
  },
  FI: function FI(str) {
    // https://dvv.fi/en/personal-identity-code#:~:text=control%20character%20for%20a-,personal,-identity%20code%20calculated
    (0, _assertString.default)(str);
    if (str.length !== 11) {
      return false;
    }
    if (!str.match(/^\d{6}[\-A\+]\d{3}[0-9ABCDEFHJKLMNPRSTUVWXY]{1}$/)) {
      return false;
    }
    var checkDigits = '0123456789ABCDEFHJKLMNPRSTUVWXY';
    var idAsNumber = parseInt(str.slice(0, 6), 10) * 1000 + parseInt(str.slice(7, 10), 10);
    var remainder = idAsNumber % 31;
    var checkDigit = checkDigits[remainder];
    return checkDigit === str.slice(10, 11);
  },
  IN: function IN(str) {
    var DNI = /^[1-9]\d{3}\s?\d{4}\s?\d{4}$/;

    // multiplication table
    var d = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]];

    // permutation table
    var p = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]];

    // sanitize user input
    var sanitized = str.trim();

    // validate the data structure
    if (!DNI.test(sanitized)) {
      return false;
    }
    var c = 0;
    var invertedArray = sanitized.replace(/\s/g, '').split('').map(Number).reverse();
    invertedArray.forEach(function (val, i) {
      c = d[c][p[i % 8][val]];
    });
    return c === 0;
  },
  IR: function IR(str) {
    if (!str.match(/^\d{10}$/)) return false;
    str = "0000".concat(str).slice(str.length - 6);
    if (parseInt(str.slice(3, 9), 10) === 0) return false;
    var lastNumber = parseInt(str.slice(9, 10), 10);
    var sum = 0;
    for (var i = 0; i < 9; i++) {
      sum += parseInt(str.slice(i, i + 1), 10) * (10 - i);
    }
    sum %= 11;
    return sum < 2 && lastNumber === sum || sum >= 2 && lastNumber === 11 - sum;
  },
  IT: function IT(str) {
    if (str.length !== 9) return false;
    if (str === 'CA00000AA') return false; // https://it.wikipedia.org/wiki/Carta_d%27identit%C3%A0_elettronica_italiana
    return str.search(/C[A-Z]\d{5}[A-Z]{2}/i) > -1;
  },
  NO: function NO(str) {
    var sanitized = str.trim();
    if (isNaN(Number(sanitized))) return false;
    if (sanitized.length !== 11) return false;
    if (sanitized === '00000000000') return false;

    // https://no.wikipedia.org/wiki/F%C3%B8dselsnummer
    var f = sanitized.split('').map(Number);
    var k1 = (11 - (3 * f[0] + 7 * f[1] + 6 * f[2] + 1 * f[3] + 8 * f[4] + 9 * f[5] + 4 * f[6] + 5 * f[7] + 2 * f[8]) % 11) % 11;
    var k2 = (11 - (5 * f[0] + 4 * f[1] + 3 * f[2] + 2 * f[3] + 7 * f[4] + 6 * f[5] + 5 * f[6] + 4 * f[7] + 3 * f[8] + 2 * k1) % 11) % 11;
    if (k1 !== f[9] || k2 !== f[10]) return false;
    return true;
  },
  TH: function TH(str) {
    if (!str.match(/^[1-8]\d{12}$/)) return false;

    // validate check digit
    var sum = 0;
    for (var i = 0; i < 12; i++) {
      sum += parseInt(str[i], 10) * (13 - i);
    }
    return str[12] === ((11 - sum % 11) % 10).toString();
  },
  LK: function LK(str) {
    var old_nic = /^[1-9]\d{8}[vx]$/i;
    var new_nic = /^[1-9]\d{11}$/i;
    if (str.length === 10 && old_nic.test(str)) return true;else if (str.length === 12 && new_nic.test(str)) return true;
    return false;
  },
  'he-IL': function heIL(str) {
    var DNI = /^\d{9}$/;

    // sanitize user input
    var sanitized = str.trim();

    // validate the data structure
    if (!DNI.test(sanitized)) {
      return false;
    }
    var id = sanitized;
    var sum = 0,
      incNum;
    for (var i = 0; i < id.length; i++) {
      incNum = Number(id[i]) * (i % 2 + 1); // Multiply number by 1 or 2
      sum += incNum > 9 ? incNum - 9 : incNum; // Sum the digits up and add to total
    }
    return sum % 10 === 0;
  },
  'ar-LY': function arLY(str) {
    // Libya National Identity Number NIN is 12 digits, the first digit is either 1 or 2
    var NIN = /^(1|2)\d{11}$/;

    // sanitize user input
    var sanitized = str.trim();

    // validate the data structure
    if (!NIN.test(sanitized)) {
      return false;
    }
    return true;
  },
  'ar-TN': function arTN(str) {
    var DNI = /^\d{8}$/;

    // sanitize user input
    var sanitized = str.trim();

    // validate the data structure
    if (!DNI.test(sanitized)) {
      return false;
    }
    return true;
  },
  'zh-CN': function zhCN(str) {
    var provincesAndCities = ['11',
    // 北京
    '12',
    // 天津
    '13',
    // 河北
    '14',
    // 山西
    '15',
    // 内蒙古
    '21',
    // 辽宁
    '22',
    // 吉林
    '23',
    // 黑龙江
    '31',
    // 上海
    '32',
    // 江苏
    '33',
    // 浙江
    '34',
    // 安徽
    '35',
    // 福建
    '36',
    // 江西
    '37',
    // 山东
    '41',
    // 河南
    '42',
    // 湖北
    '43',
    // 湖南
    '44',
    // 广东
    '45',
    // 广西
    '46',
    // 海南
    '50',
    // 重庆
    '51',
    // 四川
    '52',
    // 贵州
    '53',
    // 云南
    '54',
    // 西藏
    '61',
    // 陕西
    '62',
    // 甘肃
    '63',
    // 青海
    '64',
    // 宁夏
    '65',
    // 新疆
    '71',
    // 台湾
    '81',
    // 香港
    '82',
    // 澳门
    '91' // 国外
    ];
    var powers = ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'];
    var parityBit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var checkAddressCode = function checkAddressCode(addressCode) {
      return provincesAndCities.includes(addressCode);
    };
    var checkBirthDayCode = function checkBirthDayCode(birDayCode) {
      var yyyy = parseInt(birDayCode.substring(0, 4), 10);
      var mm = parseInt(birDayCode.substring(4, 6), 10);
      var dd = parseInt(birDayCode.substring(6), 10);
      var xdata = new Date(yyyy, mm - 1, dd);
      if (xdata > new Date()) {
        return false;
        // eslint-disable-next-line max-len
      } else if (xdata.getFullYear() === yyyy && xdata.getMonth() === mm - 1 && xdata.getDate() === dd) {
        return true;
      }
      return false;
    };
    var getParityBit = function getParityBit(idCardNo) {
      var id17 = idCardNo.substring(0, 17);
      var power = 0;
      for (var i = 0; i < 17; i++) {
        power += parseInt(id17.charAt(i), 10) * parseInt(powers[i], 10);
      }
      var mod = power % 11;
      return parityBit[mod];
    };
    var checkParityBit = function checkParityBit(idCardNo) {
      return getParityBit(idCardNo) === idCardNo.charAt(17).toUpperCase();
    };
    var check15IdCardNo = function check15IdCardNo(idCardNo) {
      var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
      if (!check) return false;
      var addressCode = idCardNo.substring(0, 2);
      check = checkAddressCode(addressCode);
      if (!check) return false;
      var birDayCode = "19".concat(idCardNo.substring(6, 12));
      check = checkBirthDayCode(birDayCode);
      if (!check) return false;
      return true;
    };
    var check18IdCardNo = function check18IdCardNo(idCardNo) {
      var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
      if (!check) return false;
      var addressCode = idCardNo.substring(0, 2);
      check = checkAddressCode(addressCode);
      if (!check) return false;
      var birDayCode = idCardNo.substring(6, 14);
      check = checkBirthDayCode(birDayCode);
      if (!check) return false;
      return checkParityBit(idCardNo);
    };
    var checkIdCardNo = function checkIdCardNo(idCardNo) {
      var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
      if (!check) return false;
      if (idCardNo.length === 15) {
        return check15IdCardNo(idCardNo);
      }
      return check18IdCardNo(idCardNo);
    };
    return checkIdCardNo(str);
  },
  'zh-HK': function zhHK(str) {
    // sanitize user input
    str = str.trim();

    // HKID number starts with 1 or 2 letters, followed by 6 digits,
    // then a checksum contained in square / round brackets or nothing
    var regexHKID = /^[A-Z]{1,2}[0-9]{6}((\([0-9A]\))|(\[[0-9A]\])|([0-9A]))$/;
    var regexIsDigit = /^[0-9]$/;

    // convert the user input to all uppercase and apply regex
    str = str.toUpperCase();
    if (!regexHKID.test(str)) return false;
    str = str.replace(/\[|\]|\(|\)/g, '');
    if (str.length === 8) str = "3".concat(str);
    var checkSumVal = 0;
    for (var i = 0; i <= 7; i++) {
      var convertedChar = void 0;
      if (!regexIsDigit.test(str[i])) convertedChar = (str[i].charCodeAt(0) - 55) % 11;else convertedChar = str[i];
      checkSumVal += convertedChar * (9 - i);
    }
    checkSumVal %= 11;
    var checkSumConverted;
    if (checkSumVal === 0) checkSumConverted = '0';else if (checkSumVal === 1) checkSumConverted = 'A';else checkSumConverted = String(11 - checkSumVal);
    if (checkSumConverted === str[str.length - 1]) return true;
    return false;
  },
  'zh-TW': function zhTW(str) {
    var ALPHABET_CODES = {
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      G: 16,
      H: 17,
      I: 34,
      J: 18,
      K: 19,
      L: 20,
      M: 21,
      N: 22,
      O: 35,
      P: 23,
      Q: 24,
      R: 25,
      S: 26,
      T: 27,
      U: 28,
      V: 29,
      W: 32,
      X: 30,
      Y: 31,
      Z: 33
    };
    var sanitized = str.trim().toUpperCase();
    if (!/^[A-Z][0-9]{9}$/.test(sanitized)) return false;
    return Array.from(sanitized).reduce(function (sum, number, index) {
      if (index === 0) {
        var code = ALPHABET_CODES[number];
        return code % 10 * 9 + Math.floor(code / 10);
      }
      if (index === 9) {
        return (10 - sum % 10 - Number(number)) % 10 === 0;
      }
      return sum + Number(number) * (9 - index);
    }, 0);
  }
};
function isIdentityCard(str, locale) {
  (0, _assertString.default)(str);
  if (locale in validators) {
    return validators[locale](str);
  } else if (locale === 'any') {
    for (var key in validators) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (validators.hasOwnProperty(key)) {
        var validator = validators[key];
        if (validator(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIn.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIn.js ***!
  \*********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isIn;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _toString = _interopRequireDefault(__webpack_require__(/*! ./util/toString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/toString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function isIn(str, options) {
  (0, _assertString.default)(str);
  var i;
  if (Object.prototype.toString.call(options) === '[object Array]') {
    var array = [];
    for (i in options) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if ({}.hasOwnProperty.call(options, i)) {
        array[i] = (0, _toString.default)(options[i]);
      }
    }
    return array.indexOf(str) >= 0;
  } else if (_typeof(options) === 'object') {
    return options.hasOwnProperty(str);
  } else if (options && typeof options.indexOf === 'function') {
    return options.indexOf(str) >= 0;
  }
  return false;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isInt.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isInt.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isInt;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var int = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
var intLeadingZeroes = /^[-+]?[0-9]+$/;
function isInt(str, options) {
  (0, _assertString.default)(str);
  options = options || {};

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  var regex = options.allow_leading_zeroes === false ? int : intLeadingZeroes;

  // Check min/max/lt/gt
  var minCheckPassed = !options.hasOwnProperty('min') || str >= options.min;
  var maxCheckPassed = !options.hasOwnProperty('max') || str <= options.max;
  var ltCheckPassed = !options.hasOwnProperty('lt') || str < options.lt;
  var gtCheckPassed = !options.hasOwnProperty('gt') || str > options.gt;
  return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isJSON.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isJSON.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isJSON;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var default_json_options = {
  allow_primitives: false
};
function isJSON(str, options) {
  (0, _assertString.default)(str);
  try {
    options = (0, _merge.default)(options, default_json_options);
    var primitives = [];
    if (options.allow_primitives) {
      primitives = [null, false, true];
    }
    var obj = JSON.parse(str);
    return primitives.includes(obj) || !!obj && _typeof(obj) === 'object';
  } catch (e) {/* ignore */}
  return false;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isJWT.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isJWT.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isJWT;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _isBase = _interopRequireDefault(__webpack_require__(/*! ./isBase64 */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isBase64.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isJWT(str) {
  (0, _assertString.default)(str);
  var dotSplit = str.split('.');
  var len = dotSplit.length;
  if (len !== 3) {
    return false;
  }
  return dotSplit.reduce(function (acc, currElem) {
    return acc && (0, _isBase.default)(currElem, {
      urlSafe: true
    });
  }, true);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLatLong.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLatLong.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isLatLong;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;
var long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;
var latDMS = /^(([1-8]?\d)\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|90\D+0\D+0)\D+[NSns]?$/i;
var longDMS = /^\s*([1-7]?\d{1,2}\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|180\D+0\D+0)\D+[EWew]?$/i;
var defaultLatLongOptions = {
  checkDMS: false
};
function isLatLong(str, options) {
  (0, _assertString.default)(str);
  options = (0, _merge.default)(options, defaultLatLongOptions);
  if (!str.includes(',')) return false;
  var pair = str.split(',');
  if (pair[0].startsWith('(') && !pair[1].endsWith(')') || pair[1].endsWith(')') && !pair[0].startsWith('(')) return false;
  if (options.checkDMS) {
    return latDMS.test(pair[0]) && longDMS.test(pair[1]);
  }
  return lat.test(pair[0]) && long.test(pair[1]);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLength.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLength.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isLength;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* eslint-disable prefer-rest-params */
function isLength(str, options) {
  (0, _assertString.default)(str);
  var min;
  var max;
  if (_typeof(options) === 'object') {
    min = options.min || 0;
    max = options.max;
  } else {
    // backwards compatibility: isLength(str, min [, max])
    min = arguments[1] || 0;
    max = arguments[2];
  }
  var presentationSequences = str.match(/(\uFE0F|\uFE0E)/g) || [];
  var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
  var len = str.length - presentationSequences.length - surrogatePairs.length;
  return len >= min && (typeof max === 'undefined' || len <= max);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLicensePlate.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLicensePlate.js ***!
  \*******************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isLicensePlate;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var validators = {
  'cs-CZ': function csCZ(str) {
    return /^(([ABCDEFHIJKLMNPRSTUVXYZ]|[0-9])-?){5,8}$/.test(str);
  },
  'de-DE': function deDE(str) {
    return /^((A|AA|AB|AC|AE|AH|AK|AM|AN|AÖ|AP|AS|AT|AU|AW|AZ|B|BA|BB|BC|BE|BF|BH|BI|BK|BL|BM|BN|BO|BÖ|BS|BT|BZ|C|CA|CB|CE|CO|CR|CW|D|DA|DD|DE|DH|DI|DL|DM|DN|DO|DU|DW|DZ|E|EA|EB|ED|EE|EF|EG|EH|EI|EL|EM|EN|ER|ES|EU|EW|F|FB|FD|FF|FG|FI|FL|FN|FO|FR|FS|FT|FÜ|FW|FZ|G|GA|GC|GD|GE|GF|GG|GI|GK|GL|GM|GN|GÖ|GP|GR|GS|GT|GÜ|GV|GW|GZ|H|HA|HB|HC|HD|HE|HF|HG|HH|HI|HK|HL|HM|HN|HO|HP|HR|HS|HU|HV|HX|HY|HZ|IK|IL|IN|IZ|J|JE|JL|K|KA|KB|KC|KE|KF|KG|KH|KI|KK|KL|KM|KN|KO|KR|KS|KT|KU|KW|KY|L|LA|LB|LC|LD|LF|LG|LH|LI|LL|LM|LN|LÖ|LP|LR|LU|M|MA|MB|MC|MD|ME|MG|MH|MI|MK|ML|MM|MN|MO|MQ|MR|MS|MÜ|MW|MY|MZ|N|NB|ND|NE|NF|NH|NI|NK|NM|NÖ|NP|NR|NT|NU|NW|NY|NZ|OA|OB|OC|OD|OE|OF|OG|OH|OK|OL|OP|OS|OZ|P|PA|PB|PE|PF|PI|PL|PM|PN|PR|PS|PW|PZ|R|RA|RC|RD|RE|RG|RH|RI|RL|RM|RN|RO|RP|RS|RT|RU|RV|RW|RZ|S|SB|SC|SE|SG|SI|SK|SL|SM|SN|SO|SP|SR|ST|SU|SW|SY|SZ|TE|TF|TG|TO|TP|TR|TS|TT|TÜ|ÜB|UE|UH|UL|UM|UN|V|VB|VG|VK|VR|VS|W|WA|WB|WE|WF|WI|WK|WL|WM|WN|WO|WR|WS|WT|WÜ|WW|WZ|Z|ZE|ZI|ZP|ZR|ZW|ZZ)[- ]?[A-Z]{1,2}[- ]?\d{1,4}|(ABG|ABI|AIB|AIC|ALF|ALZ|ANA|ANG|ANK|APD|ARN|ART|ASL|ASZ|AUR|AZE|BAD|BAR|BBG|BCH|BED|BER|BGD|BGL|BID|BIN|BIR|BIT|BIW|BKS|BLB|BLK|BNA|BOG|BOH|BOR|BOT|BRA|BRB|BRG|BRK|BRL|BRV|BSB|BSK|BTF|BÜD|BUL|BÜR|BÜS|BÜZ|CAS|CHA|CLP|CLZ|COC|COE|CUX|DAH|DAN|DAU|DBR|DEG|DEL|DGF|DIL|DIN|DIZ|DKB|DLG|DON|DUD|DÜW|EBE|EBN|EBS|ECK|EIC|EIL|EIN|EIS|EMD|EMS|ERB|ERH|ERK|ERZ|ESB|ESW|FDB|FDS|FEU|FFB|FKB|FLÖ|FOR|FRG|FRI|FRW|FTL|FÜS|GAN|GAP|GDB|GEL|GEO|GER|GHA|GHC|GLA|GMN|GNT|GOA|GOH|GRA|GRH|GRI|GRM|GRZ|GTH|GUB|GUN|GVM|HAB|HAL|HAM|HAS|HBN|HBS|HCH|HDH|HDL|HEB|HEF|HEI|HER|HET|HGN|HGW|HHM|HIG|HIP|HMÜ|HOG|HOH|HOL|HOM|HOR|HÖS|HOT|HRO|HSK|HST|HVL|HWI|IGB|ILL|JÜL|KEH|KEL|KEM|KIB|KLE|KLZ|KÖN|KÖT|KÖZ|KRU|KÜN|KUS|KYF|LAN|LAU|LBS|LBZ|LDK|LDS|LEO|LER|LEV|LIB|LIF|LIP|LÖB|LOS|LRO|LSZ|LÜN|LUP|LWL|MAB|MAI|MAK|MAL|MED|MEG|MEI|MEK|MEL|MER|MET|MGH|MGN|MHL|MIL|MKK|MOD|MOL|MON|MOS|MSE|MSH|MSP|MST|MTK|MTL|MÜB|MÜR|MYK|MZG|NAB|NAI|NAU|NDH|NEA|NEB|NEC|NEN|NES|NEW|NMB|NMS|NOH|NOL|NOM|NOR|NVP|NWM|OAL|OBB|OBG|OCH|OHA|ÖHR|OHV|OHZ|OPR|OSL|OVI|OVL|OVP|PAF|PAN|PAR|PCH|PEG|PIR|PLÖ|PRÜ|QFT|QLB|RDG|REG|REH|REI|RID|RIE|ROD|ROF|ROK|ROL|ROS|ROT|ROW|RSL|RÜD|RÜG|SAB|SAD|SAN|SAW|SBG|SBK|SCZ|SDH|SDL|SDT|SEB|SEE|SEF|SEL|SFB|SFT|SGH|SHA|SHG|SHK|SHL|SIG|SIM|SLE|SLF|SLK|SLN|SLS|SLÜ|SLZ|SMÜ|SOB|SOG|SOK|SÖM|SON|SPB|SPN|SRB|SRO|STA|STB|STD|STE|STL|SUL|SÜW|SWA|SZB|TBB|TDO|TET|TIR|TÖL|TUT|UEM|UER|UFF|USI|VAI|VEC|VER|VIB|VIE|VIT|VOH|WAF|WAK|WAN|WAR|WAT|WBS|WDA|WEL|WEN|WER|WES|WHV|WIL|WIS|WIT|WIZ|WLG|WMS|WND|WOB|WOH|WOL|WOR|WOS|WRN|WSF|WST|WSW|WTL|WTM|WUG|WÜM|WUN|WUR|WZL|ZEL|ZIG)[- ]?(([A-Z][- ]?\d{1,4})|([A-Z]{2}[- ]?\d{1,3})))[- ]?(E|H)?$/.test(str);
  },
  'de-LI': function deLI(str) {
    return /^FL[- ]?\d{1,5}[UZ]?$/.test(str);
  },
  'en-IN': function enIN(str) {
    return /^[A-Z]{2}[ -]?[0-9]{1,2}(?:[ -]?[A-Z])(?:[ -]?[A-Z]*)?[ -]?[0-9]{4}$/.test(str);
  },
  'es-AR': function esAR(str) {
    return /^(([A-Z]{2} ?[0-9]{3} ?[A-Z]{2})|([A-Z]{3} ?[0-9]{3}))$/.test(str);
  },
  'fi-FI': function fiFI(str) {
    return /^(?=.{4,7})(([A-Z]{1,3}|[0-9]{1,3})[\s-]?([A-Z]{1,3}|[0-9]{1,5}))$/.test(str);
  },
  'hu-HU': function huHU(str) {
    return /^((((?!AAA)(([A-NPRSTVZWXY]{1})([A-PR-Z]{1})([A-HJ-NPR-Z]))|(A[ABC]I)|A[ABC]O|A[A-W]Q|BPI|BPO|UCO|UDO|XAO)-(?!000)\d{3})|(M\d{6})|((CK|DT|CD|HC|H[ABEFIKLMNPRSTVX]|MA|OT|R[A-Z]) \d{2}-\d{2})|(CD \d{3}-\d{3})|(C-(C|X) \d{4})|(X-(A|B|C) \d{4})|(([EPVZ]-\d{5}))|(S A[A-Z]{2} \d{2})|(SP \d{2}-\d{2}))$/.test(str);
  },
  'pt-BR': function ptBR(str) {
    return /^[A-Z]{3}[ -]?[0-9][A-Z][0-9]{2}|[A-Z]{3}[ -]?[0-9]{4}$/.test(str);
  },
  'pt-PT': function ptPT(str) {
    return /^([A-Z]{2}|[0-9]{2})[ -·]?([A-Z]{2}|[0-9]{2})[ -·]?([A-Z]{2}|[0-9]{2})$/.test(str);
  },
  'sq-AL': function sqAL(str) {
    return /^[A-Z]{2}[- ]?((\d{3}[- ]?(([A-Z]{2})|T))|(R[- ]?\d{3}))$/.test(str);
  },
  'sv-SE': function svSE(str) {
    return /^[A-HJ-PR-UW-Z]{3} ?[\d]{2}[A-HJ-PR-UW-Z1-9]$|(^[A-ZÅÄÖ ]{2,7}$)/.test(str.trim());
  },
  'en-PK': function enPK(str) {
    return /(^[A-Z]{2}((\s|-){0,1})[0-9]{3,4}((\s|-)[0-9]{2}){0,1}$)|(^[A-Z]{3}((\s|-){0,1})[0-9]{3,4}((\s|-)[0-9]{2}){0,1}$)|(^[A-Z]{4}((\s|-){0,1})[0-9]{3,4}((\s|-)[0-9]{2}){0,1}$)|(^[A-Z]((\s|-){0,1})[0-9]{4}((\s|-)[0-9]{2}){0,1}$)/.test(str.trim());
  }
};
function isLicensePlate(str, locale) {
  (0, _assertString.default)(str);
  if (locale in validators) {
    return validators[locale](str);
  } else if (locale === 'any') {
    for (var key in validators) {
      /* eslint guard-for-in: 0 */
      var validator = validators[key];
      if (validator(str)) {
        return true;
      }
    }
    return false;
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLocale.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLocale.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isLocale;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*
  = 3ALPHA              ; selected ISO 639 codes
    *2("-" 3ALPHA)      ; permanently reserved
 */
var extlang = '([A-Za-z]{3}(-[A-Za-z]{3}){0,2})';

/*
  = 2*3ALPHA            ; shortest ISO 639 code
    ["-" extlang]       ; sometimes followed by
                        ; extended language subtags
  / 4ALPHA              ; or reserved for future use
  / 5*8ALPHA            ; or registered language subtag
 */
var language = "(([a-zA-Z]{2,3}(-".concat(extlang, ")?)|([a-zA-Z]{5,8}))");

/*
  = 4ALPHA              ; ISO 15924 code
 */
var script = '([A-Za-z]{4})';

/*
  = 2ALPHA              ; ISO 3166-1 code
  / 3DIGIT              ; UN M.49 code
 */
var region = '([A-Za-z]{2}|\\d{3})';

/*
  = 5*8alphanum         ; registered variants
  / (DIGIT 3alphanum)
 */
var variant = '([A-Za-z0-9]{5,8}|(\\d[A-Z-a-z0-9]{3}))';

/*
  = DIGIT               ; 0 - 9
  / %x41-57             ; A - W
  / %x59-5A             ; Y - Z
  / %x61-77             ; a - w
  / %x79-7A             ; y - z
 */
var singleton = '(\\d|[A-W]|[Y-Z]|[a-w]|[y-z])';

/*
  = singleton 1*("-" (2*8alphanum))
                        ; Single alphanumerics
                        ; "x" reserved for private use
 */
var extension = "(".concat(singleton, "(-[A-Za-z0-9]{2,8})+)");

/*
  = "x" 1*("-" (1*8alphanum))
 */
var privateuse = '(x(-[A-Za-z0-9]{1,8})+)';

// irregular tags do not match the 'langtag' production and would not
// otherwise be considered 'well-formed'. These tags are all valid, but
// most are deprecated in favor of more modern subtags or subtag combination

var irregular = '((en-GB-oed)|(i-ami)|(i-bnn)|(i-default)|(i-enochian)|' + '(i-hak)|(i-klingon)|(i-lux)|(i-mingo)|(i-navajo)|(i-pwn)|(i-tao)|' + '(i-tay)|(i-tsu)|(sgn-BE-FR)|(sgn-BE-NL)|(sgn-CH-DE))';

// regular tags match the 'langtag' production, but their subtags are not
// extended language or variant subtags: their meaning is defined by
// their registration and all of these are deprecated in favor of a more
// modern subtag or sequence of subtags

var regular = '((art-lojban)|(cel-gaulish)|(no-bok)|(no-nyn)|(zh-guoyu)|' + '(zh-hakka)|(zh-min)|(zh-min-nan)|(zh-xiang))';

/*
  = irregular           ; non-redundant tags registered
  / regular             ; during the RFC 3066 era

 */
var grandfathered = "(".concat(irregular, "|").concat(regular, ")");

/*
  RFC 5646 defines delimitation of subtags via a hyphen:

      "Subtag" refers to a specific section of a tag, delimited by a
      hyphen, such as the subtags 'zh', 'Hant', and 'CN' in the tag "zh-
      Hant-CN".  Examples of subtags in this document are enclosed in
      single quotes ('Hant')

  However, we need to add "_" to maintain the existing behaviour.
 */
var delimiter = '(-|_)';

/*
  = language
    ["-" script]
    ["-" region]
    *("-" variant)
    *("-" extension)
    ["-" privateuse]
 */
var langtag = "".concat(language, "(").concat(delimiter).concat(script, ")?(").concat(delimiter).concat(region, ")?(").concat(delimiter).concat(variant, ")*(").concat(delimiter).concat(extension, ")*(").concat(delimiter).concat(privateuse, ")?");

/*
  Regex implementation based on BCP RFC 5646
  Tags for Identifying Languages
  https://www.rfc-editor.org/rfc/rfc5646.html
 */
var languageTagRegex = new RegExp("(^".concat(privateuse, "$)|(^").concat(grandfathered, "$)|(^").concat(langtag, "$)"));
function isLocale(str) {
  (0, _assertString.default)(str);
  return languageTagRegex.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLowercase.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLowercase.js ***!
  \****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isLowercase;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isLowercase(str) {
  (0, _assertString.default)(str);
  return str === str.toLowerCase();
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLuhnNumber.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isLuhnNumber.js ***!
  \*****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isLuhnNumber;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isLuhnNumber(str) {
  (0, _assertString.default)(str);
  var sanitized = str.replace(/[- ]+/g, '');
  var sum = 0;
  var digit;
  var tmpNum;
  var shouldDouble;
  for (var i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += tmpNum % 10 + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!(sum % 10 === 0 ? sanitized : false);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMACAddress.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMACAddress.js ***!
  \*****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isMACAddress;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var macAddress48 = /^(?:[0-9a-fA-F]{2}([-:\s]))([0-9a-fA-F]{2}\1){4}([0-9a-fA-F]{2})$/;
var macAddress48NoSeparators = /^([0-9a-fA-F]){12}$/;
var macAddress48WithDots = /^([0-9a-fA-F]{4}\.){2}([0-9a-fA-F]{4})$/;
var macAddress64 = /^(?:[0-9a-fA-F]{2}([-:\s]))([0-9a-fA-F]{2}\1){6}([0-9a-fA-F]{2})$/;
var macAddress64NoSeparators = /^([0-9a-fA-F]){16}$/;
var macAddress64WithDots = /^([0-9a-fA-F]{4}\.){3}([0-9a-fA-F]{4})$/;
function isMACAddress(str, options) {
  (0, _assertString.default)(str);
  if (options !== null && options !== void 0 && options.eui) {
    options.eui = String(options.eui);
  }
  /**
   * @deprecated `no_colons` TODO: remove it in the next major
  */
  if (options !== null && options !== void 0 && options.no_colons || options !== null && options !== void 0 && options.no_separators) {
    if (options.eui === '48') {
      return macAddress48NoSeparators.test(str);
    }
    if (options.eui === '64') {
      return macAddress64NoSeparators.test(str);
    }
    return macAddress48NoSeparators.test(str) || macAddress64NoSeparators.test(str);
  }
  if ((options === null || options === void 0 ? void 0 : options.eui) === '48') {
    return macAddress48.test(str) || macAddress48WithDots.test(str);
  }
  if ((options === null || options === void 0 ? void 0 : options.eui) === '64') {
    return macAddress64.test(str) || macAddress64WithDots.test(str);
  }
  return isMACAddress(str, {
    eui: '48'
  }) || isMACAddress(str, {
    eui: '64'
  });
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMD5.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMD5.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isMD5;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var md5 = /^[a-f0-9]{32}$/;
function isMD5(str) {
  (0, _assertString.default)(str);
  return md5.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMagnetURI.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMagnetURI.js ***!
  \****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isMagnetURI;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var magnetURIComponent = /(?:^magnet:\?|[^?&]&)xt(?:\.1)?=urn:(?:(?:aich|bitprint|btih|ed2k|ed2khash|kzhash|md5|sha1|tree:tiger):[a-z0-9]{32}(?:[a-z0-9]{8})?|btmh:1220[a-z0-9]{64})(?:$|&)/i;
function isMagnetURI(url) {
  (0, _assertString.default)(url);
  if (url.indexOf('magnet:?') !== 0) {
    return false;
  }
  return magnetURIComponent.test(url);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMailtoURI.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMailtoURI.js ***!
  \****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isMailtoURI;
var _trim = _interopRequireDefault(__webpack_require__(/*! ./trim */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/trim.js"));
var _isEmail = _interopRequireDefault(__webpack_require__(/*! ./isEmail */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isEmail.js"));
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function parseMailtoQueryString(queryString) {
  var allowedParams = new Set(['subject', 'body', 'cc', 'bcc']),
    query = {
      cc: '',
      bcc: ''
    };
  var isParseFailed = false;
  var queryParams = queryString.split('&');
  if (queryParams.length > 4) {
    return false;
  }
  var _iterator = _createForOfIteratorHelper(queryParams),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var q = _step.value;
      var _q$split = q.split('='),
        _q$split2 = _slicedToArray(_q$split, 2),
        key = _q$split2[0],
        value = _q$split2[1];

      // checked for invalid and duplicated query params
      if (key && !allowedParams.has(key)) {
        isParseFailed = true;
        break;
      }
      if (value && (key === 'cc' || key === 'bcc')) {
        query[key] = value;
      }
      if (key) {
        allowedParams.delete(key);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return isParseFailed ? false : query;
}
function isMailtoURI(url, options) {
  (0, _assertString.default)(url);
  if (url.indexOf('mailto:') !== 0) {
    return false;
  }
  var _url$replace$split = url.replace('mailto:', '').split('?'),
    _url$replace$split2 = _slicedToArray(_url$replace$split, 2),
    to = _url$replace$split2[0],
    _url$replace$split2$ = _url$replace$split2[1],
    queryString = _url$replace$split2$ === void 0 ? '' : _url$replace$split2$;
  if (!to && !queryString) {
    return true;
  }
  var query = parseMailtoQueryString(queryString);
  if (!query) {
    return false;
  }
  return "".concat(to, ",").concat(query.cc, ",").concat(query.bcc).split(',').every(function (email) {
    email = (0, _trim.default)(email, ' ');
    if (email) {
      return (0, _isEmail.default)(email, options);
    }
    return true;
  });
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMimeType.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMimeType.js ***!
  \***************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isMimeType;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/*
  Checks if the provided string matches to a correct Media type format (MIME type)

  This function only checks is the string format follows the
  etablished rules by the according RFC specifications.
  This function supports 'charset' in textual media types
  (https://tools.ietf.org/html/rfc6657).

  This function does not check against all the media types listed
  by the IANA (https://www.iana.org/assignments/media-types/media-types.xhtml)
  because of lightness purposes : it would require to include
  all these MIME types in this librairy, which would weigh it
  significantly. This kind of effort maybe is not worth for the use that
  this function has in this entire librairy.

  More informations in the RFC specifications :
  - https://tools.ietf.org/html/rfc2045
  - https://tools.ietf.org/html/rfc2046
  - https://tools.ietf.org/html/rfc7231#section-3.1.1.1
  - https://tools.ietf.org/html/rfc7231#section-3.1.1.5
*/

// Match simple MIME types
// NB :
//   Subtype length must not exceed 100 characters.
//   This rule does not comply to the RFC specs (what is the max length ?).
var mimeTypeSimple = /^(application|audio|font|image|message|model|multipart|text|video)\/[a-zA-Z0-9\.\-\+_]{1,100}$/i; // eslint-disable-line max-len

// Handle "charset" in "text/*"
var mimeTypeText = /^text\/[a-zA-Z0-9\.\-\+]{1,100};\s?charset=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?$/i; // eslint-disable-line max-len

// Handle "boundary" in "multipart/*"
var mimeTypeMultipart = /^multipart\/[a-zA-Z0-9\.\-\+]{1,100}(;\s?(boundary|charset)=("[a-zA-Z0-9\.\-\+\s]{0,70}"|[a-zA-Z0-9\.\-\+]{0,70})(\s?\([a-zA-Z0-9\.\-\+\s]{1,20}\))?){0,2}$/i; // eslint-disable-line max-len

function isMimeType(str) {
  (0, _assertString.default)(str);
  return mimeTypeSimple.test(str) || mimeTypeText.test(str) || mimeTypeMultipart.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMobilePhone.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMobilePhone.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isMobilePhone;
exports.locales = void 0;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-len */
var phones = {
  'am-AM': /^(\+?374|0)(33|4[134]|55|77|88|9[13-689])\d{6}$/,
  'ar-AE': /^((\+?971)|0)?5[024568]\d{7}$/,
  'ar-BH': /^(\+?973)?(3|6)\d{7}$/,
  'ar-DZ': /^(\+?213|0)(5|6|7)\d{8}$/,
  'ar-LB': /^(\+?961)?((3|81)\d{6}|7\d{7})$/,
  'ar-EG': /^((\+?20)|0)?1[0125]\d{8}$/,
  'ar-IQ': /^(\+?964|0)?7[0-9]\d{8}$/,
  'ar-JO': /^(\+?962|0)?7[789]\d{7}$/,
  'ar-KW': /^(\+?965)([569]\d{7}|41\d{6})$/,
  'ar-LY': /^((\+?218)|0)?(9[1-6]\d{7}|[1-8]\d{7,9})$/,
  'ar-MA': /^(?:(?:\+|00)212|0)[5-7]\d{8}$/,
  'ar-OM': /^((\+|00)968)?(9[1-9])\d{6}$/,
  'ar-PS': /^(\+?970|0)5[6|9](\d{7})$/,
  'ar-SA': /^(!?(\+?966)|0)?5\d{8}$/,
  'ar-SD': /^((\+?249)|0)?(9[012369]|1[012])\d{7}$/,
  'ar-SY': /^(!?(\+?963)|0)?9\d{8}$/,
  'ar-TN': /^(\+?216)?[2459]\d{7}$/,
  'az-AZ': /^(\+994|0)(10|5[015]|7[07]|99)\d{7}$/,
  'bs-BA': /^((((\+|00)3876)|06))((([0-3]|[5-6])\d{6})|(4\d{7}))$/,
  'be-BY': /^(\+?375)?(24|25|29|33|44)\d{7}$/,
  'bg-BG': /^(\+?359|0)?8[789]\d{7}$/,
  'bn-BD': /^(\+?880|0)1[13456789][0-9]{8}$/,
  'ca-AD': /^(\+376)?[346]\d{5}$/,
  'cs-CZ': /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  'da-DK': /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'de-DE': /^((\+49|0)1)(5[0-25-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7,9}$/,
  'de-AT': /^(\+43|0)\d{1,4}\d{3,12}$/,
  'de-CH': /^(\+41|0)([1-9])\d{1,9}$/,
  'de-LU': /^(\+352)?((6\d1)\d{6})$/,
  'dv-MV': /^(\+?960)?(7[2-9]|9[1-9])\d{5}$/,
  'el-GR': /^(\+?30|0)?6(8[5-9]|9(?![26])[0-9])\d{7}$/,
  'el-CY': /^(\+?357?)?(9(9|6)\d{6})$/,
  'en-AI': /^(\+?1|0)264(?:2(35|92)|4(?:6[1-2]|76|97)|5(?:3[6-9]|8[1-4])|7(?:2(4|9)|72))\d{4}$/,
  'en-AU': /^(\+?61|0)4\d{8}$/,
  'en-AG': /^(?:\+1|1)268(?:464|7(?:1[3-9]|[28]\d|3[0246]|64|7[0-689]))\d{4}$/,
  'en-BM': /^(\+?1)?441(((3|7)\d{6}$)|(5[0-3][0-9]\d{4}$)|(59\d{5}$))/,
  'en-BS': /^(\+?1[-\s]?|0)?\(?242\)?[-\s]?\d{3}[-\s]?\d{4}$/,
  'en-GB': /^(\+?44|0)7\d{9}$/,
  'en-GG': /^(\+?44|0)1481\d{6}$/,
  'en-GH': /^(\+233|0)(20|50|24|54|27|57|26|56|23|28|55|59)\d{7}$/,
  'en-GY': /^(\+592|0)6\d{6}$/,
  'en-HK': /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/,
  'en-MO': /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/,
  'en-IE': /^(\+?353|0)8[356789]\d{7}$/,
  'en-IN': /^(\+?91|0)?[6789]\d{9}$/,
  'en-JM': /^(\+?876)?\d{7}$/,
  'en-KE': /^(\+?254|0)(7|1)\d{8}$/,
  'fr-CF': /^(\+?236| ?)(70|75|77|72|21|22)\d{6}$/,
  'en-SS': /^(\+?211|0)(9[1257])\d{7}$/,
  'en-KI': /^((\+686|686)?)?( )?((6|7)(2|3|8)[0-9]{6})$/,
  'en-KN': /^(?:\+1|1)869(?:46\d|48[89]|55[6-8]|66\d|76[02-7])\d{4}$/,
  'en-LS': /^(\+?266)(22|28|57|58|59|27|52)\d{6}$/,
  'en-MT': /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/,
  'en-MU': /^(\+?230|0)?\d{8}$/,
  'en-MW': /^(\+?265|0)(((77|88|31|99|98|21)\d{7})|(((111)|1)\d{6})|(32000\d{4}))$/,
  'en-NA': /^(\+?264|0)(6|8)\d{7}$/,
  'en-NG': /^(\+?234|0)?[789]\d{9}$/,
  'en-NZ': /^(\+?64|0)[28]\d{7,9}$/,
  'en-PG': /^(\+?675|0)?(7\d|8[18])\d{6}$/,
  'en-PK': /^((00|\+)?92|0)3[0-6]\d{8}$/,
  'en-PH': /^(09|\+639)\d{9}$/,
  'en-RW': /^(\+?250|0)?[7]\d{8}$/,
  'en-SG': /^(\+65)?[3689]\d{7}$/,
  'en-SL': /^(\+?232|0)\d{8}$/,
  'en-TZ': /^(\+?255|0)?[67]\d{8}$/,
  'en-UG': /^(\+?256|0)?[7]\d{8}$/,
  'en-US': /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
  'en-ZA': /^(\+?27|0)\d{9}$/,
  'en-ZM': /^(\+?26)?09[567]\d{7}$/,
  'en-ZW': /^(\+263)[0-9]{9}$/,
  'en-BW': /^(\+?267)?(7[1-8]{1})\d{6}$/,
  'es-AR': /^\+?549(11|[2368]\d)\d{8}$/,
  'es-BO': /^(\+?591)?(6|7)\d{7}$/,
  'es-CO': /^(\+?57)?3(0(0|1|2|4|5)|1\d|2[0-4]|5(0|1))\d{7}$/,
  'es-CL': /^(\+?56|0)[2-9]\d{1}\d{7}$/,
  'es-CR': /^(\+506)?[2-8]\d{7}$/,
  'es-CU': /^(\+53|0053)?5\d{7}$/,
  'es-DO': /^(\+?1)?8[024]9\d{7}$/,
  'es-HN': /^(\+?504)?[9|8|3|2]\d{7}$/,
  'es-EC': /^(\+?593|0)([2-7]|9[2-9])\d{7}$/,
  'es-ES': /^(\+?34)?[6|7]\d{8}$/,
  'es-PE': /^(\+?51)?9\d{8}$/,
  'es-MX': /^(\+?52)?(1|01)?\d{10,11}$/,
  'es-NI': /^(\+?505)\d{7,8}$/,
  'es-PA': /^(\+?507)\d{7,8}$/,
  'es-PY': /^(\+?595|0)9[9876]\d{7}$/,
  'es-SV': /^(\+?503)?[67]\d{7}$/,
  'es-UY': /^(\+598|0)9[1-9][\d]{6}$/,
  'es-VE': /^(\+?58)?(2|4)\d{9}$/,
  'et-EE': /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
  'fa-IR': /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
  'fi-FI': /^(\+?358|0)\s?(4[0-6]|50)\s?(\d\s?){4,8}$/,
  'fj-FJ': /^(\+?679)?\s?\d{3}\s?\d{4}$/,
  'fo-FO': /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'fr-BF': /^(\+226|0)[67]\d{7}$/,
  'fr-BJ': /^(\+229)\d{8}$/,
  'fr-CD': /^(\+?243|0)?(8|9)\d{8}$/,
  'fr-CM': /^(\+?237)6[0-9]{8}$/,
  'fr-FR': /^(\+?33|0)[67]\d{8}$/,
  'fr-GF': /^(\+?594|0|00594)[67]\d{8}$/,
  'fr-GP': /^(\+?590|0|00590)[67]\d{8}$/,
  'fr-MQ': /^(\+?596|0|00596)[67]\d{8}$/,
  'fr-PF': /^(\+?689)?8[789]\d{6}$/,
  'fr-RE': /^(\+?262|0|00262)[67]\d{8}$/,
  'fr-WF': /^(\+681)?\d{6}$/,
  'he-IL': /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/,
  'hu-HU': /^(\+?36|06)(20|30|31|50|70)\d{7}$/,
  'id-ID': /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
  'ir-IR': /^(\+98|0)?9\d{9}$/,
  'it-IT': /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
  'it-SM': /^((\+378)|(0549)|(\+390549)|(\+3780549))?6\d{5,9}$/,
  'ja-JP': /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/,
  'ka-GE': /^(\+?995)?(79\d{7}|5\d{8})$/,
  'kk-KZ': /^(\+?7|8)?7\d{9}$/,
  'kl-GL': /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
  'ko-KR': /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
  'ky-KG': /^(\+?7\s?\+?7|0)\s?\d{2}\s?\d{3}\s?\d{4}$/,
  'lt-LT': /^(\+370|8)\d{8}$/,
  'lv-LV': /^(\+?371)2\d{7}$/,
  'mg-MG': /^((\+?261|0)(2|3)\d)?\d{7}$/,
  'mn-MN': /^(\+|00|011)?976(77|81|88|91|94|95|96|99)\d{6}$/,
  'my-MM': /^(\+?959|09|9)(2[5-7]|3[1-2]|4[0-5]|6[6-9]|7[5-9]|9[6-9])[0-9]{7}$/,
  'ms-MY': /^(\+?60|0)1(([0145](-|\s)?\d{7,8})|([236-9](-|\s)?\d{7}))$/,
  'mz-MZ': /^(\+?258)?8[234567]\d{7}$/,
  'nb-NO': /^(\+?47)?[49]\d{7}$/,
  'ne-NP': /^(\+?977)?9[78]\d{8}$/,
  'nl-BE': /^(\+?32|0)4\d{8}$/,
  'nl-NL': /^(((\+|00)?31\(0\))|((\+|00)?31)|0)6{1}\d{8}$/,
  'nl-AW': /^(\+)?297(56|59|64|73|74|99)\d{5}$/,
  'nn-NO': /^(\+?47)?[49]\d{7}$/,
  'pl-PL': /^(\+?48)? ?([5-8]\d|45) ?\d{3} ?\d{2} ?\d{2}$/,
  'pt-BR': /^((\+?55\ ?[1-9]{2}\ ?)|(\+?55\ ?\([1-9]{2}\)\ ?)|(0[1-9]{2}\ ?)|(\([1-9]{2}\)\ ?)|([1-9]{2}\ ?))((\d{4}\-?\d{4})|(9[1-9]{1}\d{3}\-?\d{4}))$/,
  'pt-PT': /^(\+?351)?9[1236]\d{7}$/,
  'pt-AO': /^(\+244)\d{9}$/,
  'ro-MD': /^(\+?373|0)((6(0|1|2|6|7|8|9))|(7(6|7|8|9)))\d{6}$/,
  'ro-RO': /^(\+?40|0)\s?7\d{2}(\/|\s|\.|-)?\d{3}(\s|\.|-)?\d{3}$/,
  'ru-RU': /^(\+?7|8)?9\d{9}$/,
  'si-LK': /^(?:0|94|\+94)?(7(0|1|2|4|5|6|7|8)( |-)?)\d{7}$/,
  'sl-SI': /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/,
  'sk-SK': /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
  'so-SO': /^(\+?252|0)((6[0-9])\d{7}|(7[1-9])\d{7})$/,
  'sq-AL': /^(\+355|0)6[789]\d{6}$/,
  'sr-RS': /^(\+3816|06)[- \d]{5,9}$/,
  'sv-SE': /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/,
  'tg-TJ': /^(\+?992)?[5][5]\d{7}$/,
  'th-TH': /^(\+66|66|0)\d{9}$/,
  'tr-TR': /^(\+?90|0)?5\d{9}$/,
  'tk-TM': /^(\+993|993|8)\d{8}$/,
  'uk-UA': /^(\+?38|8)?0\d{9}$/,
  'uz-UZ': /^(\+?998)?(6[125-79]|7[1-69]|88|9\d)\d{7}$/,
  'vi-VN': /^((\+?84)|0)((3([2-9]))|(5([25689]))|(7([0|6-9]))|(8([1-9]))|(9([0-9])))([0-9]{7})$/,
  'zh-CN': /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/,
  'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
  'dz-BT': /^(\+?975|0)?(17|16|77|02)\d{6}$/,
  'ar-YE': /^(((\+|00)9677|0?7)[0137]\d{7}|((\+|00)967|0)[1-7]\d{6})$/,
  'ar-EH': /^(\+?212|0)[\s\-]?(5288|5289)[\s\-]?\d{5}$/,
  'fa-AF': /^(\+93|0)?(2{1}[0-8]{1}|[3-5]{1}[0-4]{1})(\d{7})$/
};
/* eslint-enable max-len */

// aliases
phones['en-CA'] = phones['en-US'];
phones['fr-CA'] = phones['en-CA'];
phones['fr-BE'] = phones['nl-BE'];
phones['zh-HK'] = phones['en-HK'];
phones['zh-MO'] = phones['en-MO'];
phones['ga-IE'] = phones['en-IE'];
phones['fr-CH'] = phones['de-CH'];
phones['it-CH'] = phones['fr-CH'];
function isMobilePhone(str, locale, options) {
  (0, _assertString.default)(str);
  if (options && options.strictMode && !str.startsWith('+')) {
    return false;
  }
  if (Array.isArray(locale)) {
    return locale.some(function (key) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (phones.hasOwnProperty(key)) {
        var phone = phones[key];
        if (phone.test(str)) {
          return true;
        }
      }
      return false;
    });
  } else if (locale in phones) {
    return phones[locale].test(str);
    // alias falsey locale as 'any'
  } else if (!locale || locale === 'any') {
    for (var key in phones) {
      // istanbul ignore else
      if (phones.hasOwnProperty(key)) {
        var phone = phones[key];
        if (phone.test(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
var locales = exports.locales = Object.keys(phones);

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMongoId.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMongoId.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isMongoId;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _isHexadecimal = _interopRequireDefault(__webpack_require__(/*! ./isHexadecimal */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHexadecimal.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isMongoId(str) {
  (0, _assertString.default)(str);
  return (0, _isHexadecimal.default)(str) && str.length === 24;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMultibyte.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isMultibyte.js ***!
  \****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isMultibyte;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable no-control-regex */
var multibyte = /[^\x00-\x7F]/;
/* eslint-enable no-control-regex */

function isMultibyte(str) {
  (0, _assertString.default)(str);
  return multibyte.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isNumeric.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isNumeric.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isNumeric;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _alpha = __webpack_require__(/*! ./alpha */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/alpha.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var numericNoSymbols = /^[0-9]+$/;
function isNumeric(str, options) {
  (0, _assertString.default)(str);
  if (options && options.no_symbols) {
    return numericNoSymbols.test(str);
  }
  return new RegExp("^[+-]?([0-9]*[".concat((options || {}).locale ? _alpha.decimal[options.locale] : '.', "])?[0-9]+$")).test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isOctal.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isOctal.js ***!
  \************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isOctal;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var octal = /^(0o)?[0-7]+$/i;
function isOctal(str) {
  (0, _assertString.default)(str);
  return octal.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isPassportNumber.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isPassportNumber.js ***!
  \*********************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isPassportNumber;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Reference:
 * https://en.wikipedia.org/ -- Wikipedia
 * https://docs.microsoft.com/en-us/microsoft-365/compliance/eu-passport-number -- EU Passport Number
 * https://countrycode.org/ -- Country Codes
 */
var passportRegexByCountryCode = {
  AM: /^[A-Z]{2}\d{7}$/,
  // ARMENIA
  AR: /^[A-Z]{3}\d{6}$/,
  // ARGENTINA
  AT: /^[A-Z]\d{7}$/,
  // AUSTRIA
  AU: /^[A-Z]\d{7}$/,
  // AUSTRALIA
  AZ: /^[A-Z]{1}\d{8}$/,
  // AZERBAIJAN
  BE: /^[A-Z]{2}\d{6}$/,
  // BELGIUM
  BG: /^\d{9}$/,
  // BULGARIA
  BR: /^[A-Z]{2}\d{6}$/,
  // BRAZIL
  BY: /^[A-Z]{2}\d{7}$/,
  // BELARUS
  CA: /^[A-Z]{2}\d{6}$/,
  // CANADA
  CH: /^[A-Z]\d{7}$/,
  // SWITZERLAND
  CN: /^G\d{8}$|^E(?![IO])[A-Z0-9]\d{7}$/,
  // CHINA [G=Ordinary, E=Electronic] followed by 8-digits, or E followed by any UPPERCASE letter (except I and O) followed by 7 digits
  CY: /^[A-Z](\d{6}|\d{8})$/,
  // CYPRUS
  CZ: /^\d{8}$/,
  // CZECH REPUBLIC
  DE: /^[CFGHJKLMNPRTVWXYZ0-9]{9}$/,
  // GERMANY
  DK: /^\d{9}$/,
  // DENMARK
  DZ: /^\d{9}$/,
  // ALGERIA
  EE: /^([A-Z]\d{7}|[A-Z]{2}\d{7})$/,
  // ESTONIA (K followed by 7-digits), e-passports have 2 UPPERCASE followed by 7 digits
  ES: /^[A-Z0-9]{2}([A-Z0-9]?)\d{6}$/,
  // SPAIN
  FI: /^[A-Z]{2}\d{7}$/,
  // FINLAND
  FR: /^\d{2}[A-Z]{2}\d{5}$/,
  // FRANCE
  GB: /^\d{9}$/,
  // UNITED KINGDOM
  GR: /^[A-Z]{2}\d{7}$/,
  // GREECE
  HR: /^\d{9}$/,
  // CROATIA
  HU: /^[A-Z]{2}(\d{6}|\d{7})$/,
  // HUNGARY
  IE: /^[A-Z0-9]{2}\d{7}$/,
  // IRELAND
  IN: /^[A-Z]{1}-?\d{7}$/,
  // INDIA
  ID: /^[A-C]\d{7}$/,
  // INDONESIA
  IR: /^[A-Z]\d{8}$/,
  // IRAN
  IS: /^(A)\d{7}$/,
  // ICELAND
  IT: /^[A-Z0-9]{2}\d{7}$/,
  // ITALY
  JM: /^[Aa]\d{7}$/,
  // JAMAICA
  JP: /^[A-Z]{2}\d{7}$/,
  // JAPAN
  KR: /^[MS]\d{8}$/,
  // SOUTH KOREA, REPUBLIC OF KOREA, [S=PS Passports, M=PM Passports]
  KZ: /^[a-zA-Z]\d{7}$/,
  // KAZAKHSTAN
  LI: /^[a-zA-Z]\d{5}$/,
  // LIECHTENSTEIN
  LT: /^[A-Z0-9]{8}$/,
  // LITHUANIA
  LU: /^[A-Z0-9]{8}$/,
  // LUXEMBURG
  LV: /^[A-Z0-9]{2}\d{7}$/,
  // LATVIA
  LY: /^[A-Z0-9]{8}$/,
  // LIBYA
  MT: /^\d{7}$/,
  // MALTA
  MZ: /^([A-Z]{2}\d{7})|(\d{2}[A-Z]{2}\d{5})$/,
  // MOZAMBIQUE
  MY: /^[AHK]\d{8}$/,
  // MALAYSIA
  MX: /^\d{10,11}$/,
  // MEXICO
  NL: /^[A-Z]{2}[A-Z0-9]{6}\d$/,
  // NETHERLANDS
  NZ: /^([Ll]([Aa]|[Dd]|[Ff]|[Hh])|[Ee]([Aa]|[Pp])|[Nn])\d{6}$/,
  // NEW ZEALAND
  PH: /^([A-Z](\d{6}|\d{7}[A-Z]))|([A-Z]{2}(\d{6}|\d{7}))$/,
  // PHILIPPINES
  PK: /^[A-Z]{2}\d{7}$/,
  // PAKISTAN
  PL: /^[A-Z]{2}\d{7}$/,
  // POLAND
  PT: /^[A-Z]\d{6}$/,
  // PORTUGAL
  RO: /^\d{8,9}$/,
  // ROMANIA
  RU: /^\d{9}$/,
  // RUSSIAN FEDERATION
  SE: /^\d{8}$/,
  // SWEDEN
  SL: /^(P)[A-Z]\d{7}$/,
  // SLOVENIA
  SK: /^[0-9A-Z]\d{7}$/,
  // SLOVAKIA
  TH: /^[A-Z]{1,2}\d{6,7}$/,
  // THAILAND
  TR: /^[A-Z]\d{8}$/,
  // TURKEY
  UA: /^[A-Z]{2}\d{6}$/,
  // UKRAINE
  US: /^\d{9}$/,
  // UNITED STATES
  ZA: /^[TAMD]\d{8}$/ // SOUTH AFRICA
};

/**
 * Check if str is a valid passport number
 * relative to provided ISO Country Code.
 *
 * @param {string} str
 * @param {string} countryCode
 * @return {boolean}
 */
function isPassportNumber(str, countryCode) {
  (0, _assertString.default)(str);
  /** Remove All Whitespaces, Convert to UPPERCASE */
  var normalizedStr = str.replace(/\s/g, '').toUpperCase();
  return countryCode.toUpperCase() in passportRegexByCountryCode && passportRegexByCountryCode[countryCode].test(normalizedStr);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isPort.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isPort.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isPort;
var _isInt = _interopRequireDefault(__webpack_require__(/*! ./isInt */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isInt.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isPort(str) {
  return (0, _isInt.default)(str, {
    allow_leading_zeroes: false,
    min: 0,
    max: 65535
  });
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isPostalCode.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isPostalCode.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isPostalCode;
exports.locales = void 0;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// common patterns
var threeDigit = /^\d{3}$/;
var fourDigit = /^\d{4}$/;
var fiveDigit = /^\d{5}$/;
var sixDigit = /^\d{6}$/;
var patterns = {
  AD: /^AD\d{3}$/,
  AT: fourDigit,
  AU: fourDigit,
  AZ: /^AZ\d{4}$/,
  BA: /^([7-8]\d{4}$)/,
  BE: fourDigit,
  BG: fourDigit,
  BR: /^\d{5}-\d{3}$/,
  BY: /^2[1-4]\d{4}$/,
  CA: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][\s\-]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
  CH: fourDigit,
  CN: /^(0[1-7]|1[012356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[1-5]|8[1345]|9[09])\d{4}$/,
  CZ: /^\d{3}\s?\d{2}$/,
  DE: fiveDigit,
  DK: fourDigit,
  DO: fiveDigit,
  DZ: fiveDigit,
  EE: fiveDigit,
  ES: /^(5[0-2]{1}|[0-4]{1}\d{1})\d{3}$/,
  FI: fiveDigit,
  FR: /^\d{2}\s?\d{3}$/,
  GB: /^(gir\s?0aa|[a-z]{1,2}\d[\da-z]?\s?(\d[a-z]{2})?)$/i,
  GR: /^\d{3}\s?\d{2}$/,
  HR: /^([1-5]\d{4}$)/,
  HT: /^HT\d{4}$/,
  HU: fourDigit,
  ID: fiveDigit,
  IE: /^(?!.*(?:o))[A-Za-z]\d[\dw]\s\w{4}$/i,
  IL: /^(\d{5}|\d{7})$/,
  IN: /^((?!10|29|35|54|55|65|66|86|87|88|89)[1-9][0-9]{5})$/,
  IR: /^(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}$/,
  IS: threeDigit,
  IT: fiveDigit,
  JP: /^\d{3}\-\d{4}$/,
  KE: fiveDigit,
  KR: /^(\d{5}|\d{6})$/,
  LI: /^(948[5-9]|949[0-7])$/,
  LT: /^LT\-\d{5}$/,
  LU: fourDigit,
  LV: /^LV\-\d{4}$/,
  LK: fiveDigit,
  MG: threeDigit,
  MX: fiveDigit,
  MT: /^[A-Za-z]{3}\s{0,1}\d{4}$/,
  MY: fiveDigit,
  NL: /^[1-9]\d{3}\s?(?!sa|sd|ss)[a-z]{2}$/i,
  NO: fourDigit,
  NP: /^(10|21|22|32|33|34|44|45|56|57)\d{3}$|^(977)$/i,
  NZ: fourDigit,
  PL: /^\d{2}\-\d{3}$/,
  PR: /^00[679]\d{2}([ -]\d{4})?$/,
  PT: /^\d{4}\-\d{3}?$/,
  RO: sixDigit,
  RU: sixDigit,
  SA: fiveDigit,
  SE: /^[1-9]\d{2}\s?\d{2}$/,
  SG: sixDigit,
  SI: fourDigit,
  SK: /^\d{3}\s?\d{2}$/,
  TH: fiveDigit,
  TN: fourDigit,
  TW: /^\d{3}(\d{2})?$/,
  UA: fiveDigit,
  US: /^\d{5}(-\d{4})?$/,
  ZA: fourDigit,
  ZM: fiveDigit
};
var locales = exports.locales = Object.keys(patterns);
function isPostalCode(str, locale) {
  (0, _assertString.default)(str);
  if (locale in patterns) {
    return patterns[locale].test(str);
  } else if (locale === 'any') {
    for (var key in patterns) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if (patterns.hasOwnProperty(key)) {
        var pattern = patterns[key];
        if (pattern.test(str)) {
          return true;
        }
      }
    }
    return false;
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isRFC3339.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isRFC3339.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isRFC3339;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */

var dateFullYear = /[0-9]{4}/;
var dateMonth = /(0[1-9]|1[0-2])/;
var dateMDay = /([12]\d|0[1-9]|3[01])/;
var timeHour = /([01][0-9]|2[0-3])/;
var timeMinute = /[0-5][0-9]/;
var timeSecond = /([0-5][0-9]|60)/;
var timeSecFrac = /(\.[0-9]+)?/;
var timeNumOffset = new RegExp("[-+]".concat(timeHour.source, ":").concat(timeMinute.source));
var timeOffset = new RegExp("([zZ]|".concat(timeNumOffset.source, ")"));
var partialTime = new RegExp("".concat(timeHour.source, ":").concat(timeMinute.source, ":").concat(timeSecond.source).concat(timeSecFrac.source));
var fullDate = new RegExp("".concat(dateFullYear.source, "-").concat(dateMonth.source, "-").concat(dateMDay.source));
var fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
var rfc3339 = new RegExp("^".concat(fullDate.source, "[ tT]").concat(fullTime.source, "$"));
function isRFC3339(str) {
  (0, _assertString.default)(str);
  return rfc3339.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isRgbColor.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isRgbColor.js ***!
  \***************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isRgbColor;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var rgbColor = /^rgb\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){2}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\)$/;
var rgbaColor = /^rgba\((([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
var rgbColorPercent = /^rgb\((([0-9]%|[1-9][0-9]%|100%),){2}([0-9]%|[1-9][0-9]%|100%)\)$/;
var rgbaColorPercent = /^rgba\((([0-9]%|[1-9][0-9]%|100%),){3}(0?\.\d|1(\.0)?|0(\.0)?)\)$/;
function isRgbColor(str) {
  var includePercentValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  (0, _assertString.default)(str);
  if (!includePercentValues) {
    return rgbColor.test(str) || rgbaColor.test(str);
  }
  return rgbColor.test(str) || rgbaColor.test(str) || rgbColorPercent.test(str) || rgbaColorPercent.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isSemVer.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isSemVer.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isSemVer;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _multilineRegex = _interopRequireDefault(__webpack_require__(/*! ./util/multilineRegex */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/multilineRegex.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Regular Expression to match
 * semantic versioning (SemVer)
 * built from multi-line, multi-parts regexp
 * Reference: https://semver.org/
 */
var semanticVersioningRegex = (0, _multilineRegex.default)(['^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)', '(?:-((?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*))*))', '?(?:\\+([0-9a-z-]+(?:\\.[0-9a-z-]+)*))?$'], 'i');
function isSemVer(str) {
  (0, _assertString.default)(str);
  return semanticVersioningRegex.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isSlug.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isSlug.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isSlug;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var charsetRegex = /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/;
function isSlug(str) {
  (0, _assertString.default)(str);
  return charsetRegex.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isStrongPassword.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isStrongPassword.js ***!
  \*********************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isStrongPassword;
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var upperCaseRegex = /^[A-Z]$/;
var lowerCaseRegex = /^[a-z]$/;
var numberRegex = /^[0-9]$/;
var symbolRegex = /^[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/\\ ]$/;
var defaultOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10
};

/* Counts number of occurrences of each char in a string
 * could be moved to util/ ?
*/
function countChars(str) {
  var result = {};
  Array.from(str).forEach(function (char) {
    var curVal = result[char];
    if (curVal) {
      result[char] += 1;
    } else {
      result[char] = 1;
    }
  });
  return result;
}

/* Return information about a password */
function analyzePassword(password) {
  var charMap = countChars(password);
  var analysis = {
    length: password.length,
    uniqueChars: Object.keys(charMap).length,
    uppercaseCount: 0,
    lowercaseCount: 0,
    numberCount: 0,
    symbolCount: 0
  };
  Object.keys(charMap).forEach(function (char) {
    /* istanbul ignore else */
    if (upperCaseRegex.test(char)) {
      analysis.uppercaseCount += charMap[char];
    } else if (lowerCaseRegex.test(char)) {
      analysis.lowercaseCount += charMap[char];
    } else if (numberRegex.test(char)) {
      analysis.numberCount += charMap[char];
    } else if (symbolRegex.test(char)) {
      analysis.symbolCount += charMap[char];
    }
  });
  return analysis;
}
function scorePassword(analysis, scoringOptions) {
  var points = 0;
  points += analysis.uniqueChars * scoringOptions.pointsPerUnique;
  points += (analysis.length - analysis.uniqueChars) * scoringOptions.pointsPerRepeat;
  if (analysis.lowercaseCount > 0) {
    points += scoringOptions.pointsForContainingLower;
  }
  if (analysis.uppercaseCount > 0) {
    points += scoringOptions.pointsForContainingUpper;
  }
  if (analysis.numberCount > 0) {
    points += scoringOptions.pointsForContainingNumber;
  }
  if (analysis.symbolCount > 0) {
    points += scoringOptions.pointsForContainingSymbol;
  }
  return points;
}
function isStrongPassword(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  (0, _assertString.default)(str);
  var analysis = analyzePassword(str);
  options = (0, _merge.default)(options || {}, defaultOptions);
  if (options.returnScore) {
    return scorePassword(analysis, options);
  }
  return analysis.length >= options.minLength && analysis.lowercaseCount >= options.minLowercase && analysis.uppercaseCount >= options.minUppercase && analysis.numberCount >= options.minNumbers && analysis.symbolCount >= options.minSymbols;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isSurrogatePair.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isSurrogatePair.js ***!
  \********************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isSurrogatePair;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;
function isSurrogatePair(str) {
  (0, _assertString.default)(str);
  return surrogatePair.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isTaxID.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isTaxID.js ***!
  \************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isTaxID;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var algorithms = _interopRequireWildcard(__webpack_require__(/*! ./util/algorithms */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/algorithms.js"));
var _isDate = _interopRequireDefault(__webpack_require__(/*! ./isDate */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isDate.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * TIN Validation
 * Validates Tax Identification Numbers (TINs) from the US, EU member states and the United Kingdom.
 *
 * EU-UK:
 * National TIN validity is calculated using public algorithms as made available by DG TAXUD.
 *
 * See `https://ec.europa.eu/taxation_customs/tin/specs/FS-TIN%20Algorithms-Public.docx` for more information.
 *
 * US:
 * An Employer Identification Number (EIN), also known as a Federal Tax Identification Number,
 *  is used to identify a business entity.
 *
 * NOTES:
 *  - Prefix 47 is being reserved for future use
 *  - Prefixes 26, 27, 45, 46 and 47 were previously assigned by the Philadelphia campus.
 *
 * See `http://www.irs.gov/Businesses/Small-Businesses-&-Self-Employed/How-EINs-are-Assigned-and-Valid-EIN-Prefixes`
 * for more information.
 */

// Locale functions

/*
 * bg-BG validation function
 * (Edinen graždanski nomer (EGN/ЕГН), persons only)
 * Checks if birth date (first six digits) is valid and calculates check (last) digit
 */
function bgBgCheck(tin) {
  // Extract full year, normalize month and check birth date validity
  var century_year = tin.slice(0, 2);
  var month = parseInt(tin.slice(2, 4), 10);
  if (month > 40) {
    month -= 40;
    century_year = "20".concat(century_year);
  } else if (month > 20) {
    month -= 20;
    century_year = "18".concat(century_year);
  } else {
    century_year = "19".concat(century_year);
  }
  if (month < 10) {
    month = "0".concat(month);
  }
  var date = "".concat(century_year, "/").concat(month, "/").concat(tin.slice(4, 6));
  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  }

  // split digits into an array for further processing
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });

  // Calculate checksum by multiplying digits with fixed values
  var multip_lookup = [2, 4, 8, 5, 10, 9, 7, 3, 6];
  var checksum = 0;
  for (var i = 0; i < multip_lookup.length; i++) {
    checksum += digits[i] * multip_lookup[i];
  }
  checksum = checksum % 11 === 10 ? 0 : checksum % 11;
  return checksum === digits[9];
}

/**
 * Check if an input is a valid Canadian SIN (Social Insurance Number)
 *
 * The Social Insurance Number (SIN) is a 9 digit number that
 * you need to work in Canada or to have access to government programs and benefits.
 *
 * https://en.wikipedia.org/wiki/Social_Insurance_Number
 * https://www.canada.ca/en/employment-social-development/services/sin.html
 * https://www.codercrunch.com/challenge/819302488/sin-validator
 *
 * @param {string} input
 * @return {boolean}
 */
function isCanadianSIN(input) {
  var digitsArray = input.split('');
  var even = digitsArray.filter(function (_, idx) {
    return idx % 2;
  }).map(function (i) {
    return Number(i) * 2;
  }).join('').split('');
  var total = digitsArray.filter(function (_, idx) {
    return !(idx % 2);
  }).concat(even).map(function (i) {
    return Number(i);
  }).reduce(function (acc, cur) {
    return acc + cur;
  });
  return total % 10 === 0;
}

/*
 * cs-CZ validation function
 * (Rodné číslo (RČ), persons only)
 * Checks if birth date (first six digits) is valid and divisibility by 11
 * Material not in DG TAXUD document sourced from:
 * -`https://lorenc.info/3MA381/overeni-spravnosti-rodneho-cisla.htm`
 * -`https://www.mvcr.cz/clanek/rady-a-sluzby-dokumenty-rodne-cislo.aspx`
 */
function csCzCheck(tin) {
  tin = tin.replace(/\W/, '');

  // Extract full year from TIN length
  var full_year = parseInt(tin.slice(0, 2), 10);
  if (tin.length === 10) {
    if (full_year < 54) {
      full_year = "20".concat(full_year);
    } else {
      full_year = "19".concat(full_year);
    }
  } else {
    if (tin.slice(6) === '000') {
      return false;
    } // Three-zero serial not assigned before 1954
    if (full_year < 54) {
      full_year = "19".concat(full_year);
    } else {
      return false; // No 18XX years seen in any of the resources
    }
  }
  // Add missing zero if needed
  if (full_year.length === 3) {
    full_year = [full_year.slice(0, 2), '0', full_year.slice(2)].join('');
  }

  // Extract month from TIN and normalize
  var month = parseInt(tin.slice(2, 4), 10);
  if (month > 50) {
    month -= 50;
  }
  if (month > 20) {
    // Month-plus-twenty was only introduced in 2004
    if (parseInt(full_year, 10) < 2004) {
      return false;
    }
    month -= 20;
  }
  if (month < 10) {
    month = "0".concat(month);
  }

  // Check date validity
  var date = "".concat(full_year, "/").concat(month, "/").concat(tin.slice(4, 6));
  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  }

  // Verify divisibility by 11
  if (tin.length === 10) {
    if (parseInt(tin, 10) % 11 !== 0) {
      // Some numbers up to and including 1985 are still valid if
      // check (last) digit equals 0 and modulo of first 9 digits equals 10
      var checkdigit = parseInt(tin.slice(0, 9), 10) % 11;
      if (parseInt(full_year, 10) < 1986 && checkdigit === 10) {
        if (parseInt(tin.slice(9), 10) !== 0) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  return true;
}

/*
 * de-AT validation function
 * (Abgabenkontonummer, persons/entities)
 * Verify TIN validity by calling luhnCheck()
 */
function deAtCheck(tin) {
  return algorithms.luhnCheck(tin);
}

/*
 * de-DE validation function
 * (Steueridentifikationsnummer (Steuer-IdNr.), persons only)
 * Tests for single duplicate/triplicate value, then calculates ISO 7064 check (last) digit
 * Partial implementation of spec (same result with both algorithms always)
 */
function deDeCheck(tin) {
  // Split digits into an array for further processing
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });

  // Fill array with strings of number positions
  var occurences = [];
  for (var i = 0; i < digits.length - 1; i++) {
    occurences.push('');
    for (var j = 0; j < digits.length - 1; j++) {
      if (digits[i] === digits[j]) {
        occurences[i] += j;
      }
    }
  }

  // Remove digits with one occurence and test for only one duplicate/triplicate
  occurences = occurences.filter(function (a) {
    return a.length > 1;
  });
  if (occurences.length !== 2 && occurences.length !== 3) {
    return false;
  }

  // In case of triplicate value only two digits are allowed next to each other
  if (occurences[0].length === 3) {
    var trip_locations = occurences[0].split('').map(function (a) {
      return parseInt(a, 10);
    });
    var recurrent = 0; // Amount of neighbour occurences
    for (var _i = 0; _i < trip_locations.length - 1; _i++) {
      if (trip_locations[_i] + 1 === trip_locations[_i + 1]) {
        recurrent += 1;
      }
    }
    if (recurrent === 2) {
      return false;
    }
  }
  return algorithms.iso7064Check(tin);
}

/*
 * dk-DK validation function
 * (CPR-nummer (personnummer), persons only)
 * Checks if birth date (first six digits) is valid and assigned to century (seventh) digit,
 * and calculates check (last) digit
 */
function dkDkCheck(tin) {
  tin = tin.replace(/\W/, '');

  // Extract year, check if valid for given century digit and add century
  var year = parseInt(tin.slice(4, 6), 10);
  var century_digit = tin.slice(6, 7);
  switch (century_digit) {
    case '0':
    case '1':
    case '2':
    case '3':
      year = "19".concat(year);
      break;
    case '4':
    case '9':
      if (year < 37) {
        year = "20".concat(year);
      } else {
        year = "19".concat(year);
      }
      break;
    default:
      if (year < 37) {
        year = "20".concat(year);
      } else if (year > 58) {
        year = "18".concat(year);
      } else {
        return false;
      }
      break;
  }
  // Add missing zero if needed
  if (year.length === 3) {
    year = [year.slice(0, 2), '0', year.slice(2)].join('');
  }
  // Check date validity
  var date = "".concat(year, "/").concat(tin.slice(2, 4), "/").concat(tin.slice(0, 2));
  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  }

  // Split digits into an array for further processing
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 0;
  var weight = 4;
  // Multiply by weight and add to checksum
  for (var i = 0; i < 9; i++) {
    checksum += digits[i] * weight;
    weight -= 1;
    if (weight === 1) {
      weight = 7;
    }
  }
  checksum %= 11;
  if (checksum === 1) {
    return false;
  }
  return checksum === 0 ? digits[9] === 0 : digits[9] === 11 - checksum;
}

/*
 * el-CY validation function
 * (Arithmos Forologikou Mitroou (AFM/ΑΦΜ), persons only)
 * Verify TIN validity by calculating ASCII value of check (last) character
 */
function elCyCheck(tin) {
  // split digits into an array for further processing
  var digits = tin.slice(0, 8).split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 0;
  // add digits in even places
  for (var i = 1; i < digits.length; i += 2) {
    checksum += digits[i];
  }

  // add digits in odd places
  for (var _i2 = 0; _i2 < digits.length; _i2 += 2) {
    if (digits[_i2] < 2) {
      checksum += 1 - digits[_i2];
    } else {
      checksum += 2 * (digits[_i2] - 2) + 5;
      if (digits[_i2] > 4) {
        checksum += 2;
      }
    }
  }
  return String.fromCharCode(checksum % 26 + 65) === tin.charAt(8);
}

/*
 * el-GR validation function
 * (Arithmos Forologikou Mitroou (AFM/ΑΦΜ), persons/entities)
 * Verify TIN validity by calculating check (last) digit
 * Algorithm not in DG TAXUD document- sourced from:
 * - `http://epixeirisi.gr/%CE%9A%CE%A1%CE%99%CE%A3%CE%99%CE%9C%CE%91-%CE%98%CE%95%CE%9C%CE%91%CE%A4%CE%91-%CE%A6%CE%9F%CE%A1%CE%9F%CE%9B%CE%9F%CE%93%CE%99%CE%91%CE%A3-%CE%9A%CE%91%CE%99-%CE%9B%CE%9F%CE%93%CE%99%CE%A3%CE%A4%CE%99%CE%9A%CE%97%CE%A3/23791/%CE%91%CF%81%CE%B9%CE%B8%CE%BC%CF%8C%CF%82-%CE%A6%CE%BF%CF%81%CE%BF%CE%BB%CE%BF%CE%B3%CE%B9%CE%BA%CE%BF%CF%8D-%CE%9C%CE%B7%CF%84%CF%81%CF%8E%CE%BF%CF%85`
 */
function elGrCheck(tin) {
  // split digits into an array for further processing
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 0;
  for (var i = 0; i < 8; i++) {
    checksum += digits[i] * Math.pow(2, 8 - i);
  }
  return checksum % 11 % 10 === digits[8];
}

/*
 * en-GB validation function (should go here if needed)
 * (National Insurance Number (NINO) or Unique Taxpayer Reference (UTR),
 * persons/entities respectively)
 */

/*
 * en-IE validation function
 * (Personal Public Service Number (PPS No), persons only)
 * Verify TIN validity by calculating check (second to last) character
 */
function enIeCheck(tin) {
  var checksum = algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 7).map(function (a) {
    return parseInt(a, 10);
  }), 8);
  if (tin.length === 9 && tin[8] !== 'W') {
    checksum += (tin[8].charCodeAt(0) - 64) * 9;
  }
  checksum %= 23;
  if (checksum === 0) {
    return tin[7].toUpperCase() === 'W';
  }
  return tin[7].toUpperCase() === String.fromCharCode(64 + checksum);
}

// Valid US IRS campus prefixes
var enUsCampusPrefix = {
  andover: ['10', '12'],
  atlanta: ['60', '67'],
  austin: ['50', '53'],
  brookhaven: ['01', '02', '03', '04', '05', '06', '11', '13', '14', '16', '21', '22', '23', '25', '34', '51', '52', '54', '55', '56', '57', '58', '59', '65'],
  cincinnati: ['30', '32', '35', '36', '37', '38', '61'],
  fresno: ['15', '24'],
  internet: ['20', '26', '27', '45', '46', '47'],
  kansas: ['40', '44'],
  memphis: ['94', '95'],
  ogden: ['80', '90'],
  philadelphia: ['33', '39', '41', '42', '43', '46', '48', '62', '63', '64', '66', '68', '71', '72', '73', '74', '75', '76', '77', '81', '82', '83', '84', '85', '86', '87', '88', '91', '92', '93', '98', '99'],
  sba: ['31']
};

// Return an array of all US IRS campus prefixes
function enUsGetPrefixes() {
  var prefixes = [];
  for (var location in enUsCampusPrefix) {
    // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
    // istanbul ignore else
    if (enUsCampusPrefix.hasOwnProperty(location)) {
      prefixes.push.apply(prefixes, _toConsumableArray(enUsCampusPrefix[location]));
    }
  }
  return prefixes;
}

/*
 * en-US validation function
 * Verify that the TIN starts with a valid IRS campus prefix
 */
function enUsCheck(tin) {
  return enUsGetPrefixes().indexOf(tin.slice(0, 2)) !== -1;
}

/*
 * es-AR validation function
 * Clave Única de Identificación Tributaria (CUIT/CUIL)
 * Sourced from:
 * - https://servicioscf.afip.gob.ar/publico/abc/ABCpaso2.aspx?id_nivel1=3036&id_nivel2=3040&p=Conceptos%20b%C3%A1sicos
 * - https://es.wikipedia.org/wiki/Clave_%C3%9Anica_de_Identificaci%C3%B3n_Tributaria
 */

function esArCheck(tin) {
  var accum = 0;
  var digits = tin.split('');
  var digit = parseInt(digits.pop(), 10);
  for (var i = 0; i < digits.length; i++) {
    accum += digits[9 - i] * (2 + i % 6);
  }
  var verif = 11 - accum % 11;
  if (verif === 11) {
    verif = 0;
  } else if (verif === 10) {
    verif = 9;
  }
  return digit === verif;
}

/*
 * es-ES validation function
 * (Documento Nacional de Identidad (DNI)
 * or Número de Identificación de Extranjero (NIE), persons only)
 * Verify TIN validity by calculating check (last) character
 */
function esEsCheck(tin) {
  // Split characters into an array for further processing
  var chars = tin.toUpperCase().split('');

  // Replace initial letter if needed
  if (isNaN(parseInt(chars[0], 10)) && chars.length > 1) {
    var lead_replace = 0;
    switch (chars[0]) {
      case 'Y':
        lead_replace = 1;
        break;
      case 'Z':
        lead_replace = 2;
        break;
      default:
    }
    chars.splice(0, 1, lead_replace);
    // Fill with zeros if smaller than proper
  } else {
    while (chars.length < 9) {
      chars.unshift(0);
    }
  }

  // Calculate checksum and check according to lookup
  var lookup = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E'];
  chars = chars.join('');
  var checksum = parseInt(chars.slice(0, 8), 10) % 23;
  return chars[8] === lookup[checksum];
}

/*
 * et-EE validation function
 * (Isikukood (IK), persons only)
 * Checks if birth date (century digit and six following) is valid and calculates check (last) digit
 * Material not in DG TAXUD document sourced from:
 * - `https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Estonia-TIN.pdf`
 */
function etEeCheck(tin) {
  // Extract year and add century
  var full_year = tin.slice(1, 3);
  var century_digit = tin.slice(0, 1);
  switch (century_digit) {
    case '1':
    case '2':
      full_year = "18".concat(full_year);
      break;
    case '3':
    case '4':
      full_year = "19".concat(full_year);
      break;
    default:
      full_year = "20".concat(full_year);
      break;
  }
  // Check date validity
  var date = "".concat(full_year, "/").concat(tin.slice(3, 5), "/").concat(tin.slice(5, 7));
  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  }

  // Split digits into an array for further processing
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 0;
  var weight = 1;
  // Multiply by weight and add to checksum
  for (var i = 0; i < 10; i++) {
    checksum += digits[i] * weight;
    weight += 1;
    if (weight === 10) {
      weight = 1;
    }
  }
  // Do again if modulo 11 of checksum is 10
  if (checksum % 11 === 10) {
    checksum = 0;
    weight = 3;
    for (var _i3 = 0; _i3 < 10; _i3++) {
      checksum += digits[_i3] * weight;
      weight += 1;
      if (weight === 10) {
        weight = 1;
      }
    }
    if (checksum % 11 === 10) {
      return digits[10] === 0;
    }
  }
  return checksum % 11 === digits[10];
}

/*
 * fi-FI validation function
 * (Henkilötunnus (HETU), persons only)
 * Checks if birth date (first six digits plus century symbol) is valid
 * and calculates check (last) digit
 */
function fiFiCheck(tin) {
  // Extract year and add century
  var full_year = tin.slice(4, 6);
  var century_symbol = tin.slice(6, 7);
  switch (century_symbol) {
    case '+':
      full_year = "18".concat(full_year);
      break;
    case '-':
      full_year = "19".concat(full_year);
      break;
    default:
      full_year = "20".concat(full_year);
      break;
  }
  // Check date validity
  var date = "".concat(full_year, "/").concat(tin.slice(2, 4), "/").concat(tin.slice(0, 2));
  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  }

  // Calculate check character
  var checksum = parseInt(tin.slice(0, 6) + tin.slice(7, 10), 10) % 31;
  if (checksum < 10) {
    return checksum === parseInt(tin.slice(10), 10);
  }
  checksum -= 10;
  var letters_lookup = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];
  return letters_lookup[checksum] === tin.slice(10);
}

/*
 * fr/nl-BE validation function
 * (Numéro national (N.N.), persons only)
 * Checks if birth date (first six digits) is valid and calculates check (last two) digits
 */
function frBeCheck(tin) {
  // Zero month/day value is acceptable
  if (tin.slice(2, 4) !== '00' || tin.slice(4, 6) !== '00') {
    // Extract date from first six digits of TIN
    var date = "".concat(tin.slice(0, 2), "/").concat(tin.slice(2, 4), "/").concat(tin.slice(4, 6));
    if (!(0, _isDate.default)(date, 'YY/MM/DD')) {
      return false;
    }
  }
  var checksum = 97 - parseInt(tin.slice(0, 9), 10) % 97;
  var checkdigits = parseInt(tin.slice(9, 11), 10);
  if (checksum !== checkdigits) {
    checksum = 97 - parseInt("2".concat(tin.slice(0, 9)), 10) % 97;
    if (checksum !== checkdigits) {
      return false;
    }
  }
  return true;
}

/*
 * fr-FR validation function
 * (Numéro fiscal de référence (numéro SPI), persons only)
 * Verify TIN validity by calculating check (last three) digits
 */
function frFrCheck(tin) {
  tin = tin.replace(/\s/g, '');
  var checksum = parseInt(tin.slice(0, 10), 10) % 511;
  var checkdigits = parseInt(tin.slice(10, 13), 10);
  return checksum === checkdigits;
}

/*
 * fr/lb-LU validation function
 * (numéro d’identification personnelle, persons only)
 * Verify birth date validity and run Luhn and Verhoeff checks
 */
function frLuCheck(tin) {
  // Extract date and check validity
  var date = "".concat(tin.slice(0, 4), "/").concat(tin.slice(4, 6), "/").concat(tin.slice(6, 8));
  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  }

  // Run Luhn check
  if (!algorithms.luhnCheck(tin.slice(0, 12))) {
    return false;
  }
  // Remove Luhn check digit and run Verhoeff check
  return algorithms.verhoeffCheck("".concat(tin.slice(0, 11)).concat(tin[12]));
}

/*
 * hr-HR validation function
 * (Osobni identifikacijski broj (OIB), persons/entities)
 * Verify TIN validity by calling iso7064Check(digits)
 */
function hrHrCheck(tin) {
  return algorithms.iso7064Check(tin);
}

/*
 * hu-HU validation function
 * (Adóazonosító jel, persons only)
 * Verify TIN validity by calculating check (last) digit
 */
function huHuCheck(tin) {
  // split digits into an array for further processing
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });
  var checksum = 8;
  for (var i = 1; i < 9; i++) {
    checksum += digits[i] * (i + 1);
  }
  return checksum % 11 === digits[9];
}

/*
 * lt-LT validation function (should go here if needed)
 * (Asmens kodas, persons/entities respectively)
 * Current validation check is alias of etEeCheck- same format applies
 */

/*
 * it-IT first/last name validity check
 * Accepts it-IT TIN-encoded names as a three-element character array and checks their validity
 * Due to lack of clarity between resources ("Are only Italian consonants used?
 * What happens if a person has X in their name?" etc.) only two test conditions
 * have been implemented:
 * Vowels may only be followed by other vowels or an X character
 * and X characters after vowels may only be followed by other X characters.
 */
function itItNameCheck(name) {
  // true at the first occurence of a vowel
  var vowelflag = false;

  // true at the first occurence of an X AFTER vowel
  // (to properly handle last names with X as consonant)
  var xflag = false;
  for (var i = 0; i < 3; i++) {
    if (!vowelflag && /[AEIOU]/.test(name[i])) {
      vowelflag = true;
    } else if (!xflag && vowelflag && name[i] === 'X') {
      xflag = true;
    } else if (i > 0) {
      if (vowelflag && !xflag) {
        if (!/[AEIOU]/.test(name[i])) {
          return false;
        }
      }
      if (xflag) {
        if (!/X/.test(name[i])) {
          return false;
        }
      }
    }
  }
  return true;
}

/*
 * it-IT validation function
 * (Codice fiscale (TIN-IT), persons only)
 * Verify name, birth date and codice catastale validity
 * and calculate check character.
 * Material not in DG-TAXUD document sourced from:
 * `https://en.wikipedia.org/wiki/Italian_fiscal_code`
 */
function itItCheck(tin) {
  // Capitalize and split characters into an array for further processing
  var chars = tin.toUpperCase().split('');

  // Check first and last name validity calling itItNameCheck()
  if (!itItNameCheck(chars.slice(0, 3))) {
    return false;
  }
  if (!itItNameCheck(chars.slice(3, 6))) {
    return false;
  }

  // Convert letters in number spaces back to numbers if any
  var number_locations = [6, 7, 9, 10, 12, 13, 14];
  var number_replace = {
    L: '0',
    M: '1',
    N: '2',
    P: '3',
    Q: '4',
    R: '5',
    S: '6',
    T: '7',
    U: '8',
    V: '9'
  };
  for (var _i4 = 0, _number_locations = number_locations; _i4 < _number_locations.length; _i4++) {
    var i = _number_locations[_i4];
    if (chars[i] in number_replace) {
      chars.splice(i, 1, number_replace[chars[i]]);
    }
  }

  // Extract month and day, and check date validity
  var month_replace = {
    A: '01',
    B: '02',
    C: '03',
    D: '04',
    E: '05',
    H: '06',
    L: '07',
    M: '08',
    P: '09',
    R: '10',
    S: '11',
    T: '12'
  };
  var month = month_replace[chars[8]];
  var day = parseInt(chars[9] + chars[10], 10);
  if (day > 40) {
    day -= 40;
  }
  if (day < 10) {
    day = "0".concat(day);
  }
  var date = "".concat(chars[6]).concat(chars[7], "/").concat(month, "/").concat(day);
  if (!(0, _isDate.default)(date, 'YY/MM/DD')) {
    return false;
  }

  // Calculate check character by adding up even and odd characters as numbers
  var checksum = 0;
  for (var _i5 = 1; _i5 < chars.length - 1; _i5 += 2) {
    var char_to_int = parseInt(chars[_i5], 10);
    if (isNaN(char_to_int)) {
      char_to_int = chars[_i5].charCodeAt(0) - 65;
    }
    checksum += char_to_int;
  }
  var odd_convert = {
    // Maps of characters at odd places
    A: 1,
    B: 0,
    C: 5,
    D: 7,
    E: 9,
    F: 13,
    G: 15,
    H: 17,
    I: 19,
    J: 21,
    K: 2,
    L: 4,
    M: 18,
    N: 20,
    O: 11,
    P: 3,
    Q: 6,
    R: 8,
    S: 12,
    T: 14,
    U: 16,
    V: 10,
    W: 22,
    X: 25,
    Y: 24,
    Z: 23,
    0: 1,
    1: 0
  };
  for (var _i6 = 0; _i6 < chars.length - 1; _i6 += 2) {
    var _char_to_int = 0;
    if (chars[_i6] in odd_convert) {
      _char_to_int = odd_convert[chars[_i6]];
    } else {
      var multiplier = parseInt(chars[_i6], 10);
      _char_to_int = 2 * multiplier + 1;
      if (multiplier > 4) {
        _char_to_int += 2;
      }
    }
    checksum += _char_to_int;
  }
  if (String.fromCharCode(65 + checksum % 26) !== chars[15]) {
    return false;
  }
  return true;
}

/*
 * lv-LV validation function
 * (Personas kods (PK), persons only)
 * Check validity of birth date and calculate check (last) digit
 * Support only for old format numbers (not starting with '32', issued before 2017/07/01)
 * Material not in DG TAXUD document sourced from:
 * `https://boot.ritakafija.lv/forums/index.php?/topic/88314-personas-koda-algoritms-%C4%8Deksumma/`
 */
function lvLvCheck(tin) {
  tin = tin.replace(/\W/, '');
  // Extract date from TIN
  var day = tin.slice(0, 2);
  if (day !== '32') {
    // No date/checksum check if new format
    var month = tin.slice(2, 4);
    if (month !== '00') {
      // No date check if unknown month
      var full_year = tin.slice(4, 6);
      switch (tin[6]) {
        case '0':
          full_year = "18".concat(full_year);
          break;
        case '1':
          full_year = "19".concat(full_year);
          break;
        default:
          full_year = "20".concat(full_year);
          break;
      }
      // Check date validity
      var date = "".concat(full_year, "/").concat(tin.slice(2, 4), "/").concat(day);
      if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
        return false;
      }
    }

    // Calculate check digit
    var checksum = 1101;
    var multip_lookup = [1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    for (var i = 0; i < tin.length - 1; i++) {
      checksum -= parseInt(tin[i], 10) * multip_lookup[i];
    }
    return parseInt(tin[10], 10) === checksum % 11;
  }
  return true;
}

/*
 * mt-MT validation function
 * (Identity Card Number or Unique Taxpayer Reference, persons/entities)
 * Verify Identity Card Number structure (no other tests found)
 */
function mtMtCheck(tin) {
  if (tin.length !== 9) {
    // No tests for UTR
    var chars = tin.toUpperCase().split('');
    // Fill with zeros if smaller than proper
    while (chars.length < 8) {
      chars.unshift(0);
    }
    // Validate format according to last character
    switch (tin[7]) {
      case 'A':
      case 'P':
        if (parseInt(chars[6], 10) === 0) {
          return false;
        }
        break;
      default:
        {
          var first_part = parseInt(chars.join('').slice(0, 5), 10);
          if (first_part > 32000) {
            return false;
          }
          var second_part = parseInt(chars.join('').slice(5, 7), 10);
          if (first_part === second_part) {
            return false;
          }
        }
    }
  }
  return true;
}

/*
 * nl-NL validation function
 * (Burgerservicenummer (BSN) or Rechtspersonen Samenwerkingsverbanden Informatie Nummer (RSIN),
 * persons/entities respectively)
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */
function nlNlCheck(tin) {
  return algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 8).map(function (a) {
    return parseInt(a, 10);
  }), 9) % 11 === parseInt(tin[8], 10);
}

/*
 * pl-PL validation function
 * (Powszechny Elektroniczny System Ewidencji Ludności (PESEL)
 * or Numer identyfikacji podatkowej (NIP), persons/entities)
 * Verify TIN validity by validating birth date (PESEL) and calculating check (last) digit
 */
function plPlCheck(tin) {
  // NIP
  if (tin.length === 10) {
    // Calculate last digit by multiplying with lookup
    var lookup = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    var _checksum = 0;
    for (var i = 0; i < lookup.length; i++) {
      _checksum += parseInt(tin[i], 10) * lookup[i];
    }
    _checksum %= 11;
    if (_checksum === 10) {
      return false;
    }
    return _checksum === parseInt(tin[9], 10);
  }

  // PESEL
  // Extract full year using month
  var full_year = tin.slice(0, 2);
  var month = parseInt(tin.slice(2, 4), 10);
  if (month > 80) {
    full_year = "18".concat(full_year);
    month -= 80;
  } else if (month > 60) {
    full_year = "22".concat(full_year);
    month -= 60;
  } else if (month > 40) {
    full_year = "21".concat(full_year);
    month -= 40;
  } else if (month > 20) {
    full_year = "20".concat(full_year);
    month -= 20;
  } else {
    full_year = "19".concat(full_year);
  }
  // Add leading zero to month if needed
  if (month < 10) {
    month = "0".concat(month);
  }
  // Check date validity
  var date = "".concat(full_year, "/").concat(month, "/").concat(tin.slice(4, 6));
  if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  }

  // Calculate last digit by mulitplying with odd one-digit numbers except 5
  var checksum = 0;
  var multiplier = 1;
  for (var _i7 = 0; _i7 < tin.length - 1; _i7++) {
    checksum += parseInt(tin[_i7], 10) * multiplier % 10;
    multiplier += 2;
    if (multiplier > 10) {
      multiplier = 1;
    } else if (multiplier === 5) {
      multiplier += 2;
    }
  }
  checksum = 10 - checksum % 10;
  return checksum === parseInt(tin[10], 10);
}

/*
* pt-BR validation function
* (Cadastro de Pessoas Físicas (CPF, persons)
* Cadastro Nacional de Pessoas Jurídicas (CNPJ, entities)
* Both inputs will be validated
*/

function ptBrCheck(tin) {
  if (tin.length === 11) {
    var _sum;
    var remainder;
    _sum = 0;
    if (
    // Reject known invalid CPFs
    tin === '11111111111' || tin === '22222222222' || tin === '33333333333' || tin === '44444444444' || tin === '55555555555' || tin === '66666666666' || tin === '77777777777' || tin === '88888888888' || tin === '99999999999' || tin === '00000000000') return false;
    for (var i = 1; i <= 9; i++) _sum += parseInt(tin.substring(i - 1, i), 10) * (11 - i);
    remainder = _sum * 10 % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(tin.substring(9, 10), 10)) return false;
    _sum = 0;
    for (var _i8 = 1; _i8 <= 10; _i8++) _sum += parseInt(tin.substring(_i8 - 1, _i8), 10) * (12 - _i8);
    remainder = _sum * 10 % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(tin.substring(10, 11), 10)) return false;
    return true;
  }
  if (
  // Reject know invalid CNPJs
  tin === '00000000000000' || tin === '11111111111111' || tin === '22222222222222' || tin === '33333333333333' || tin === '44444444444444' || tin === '55555555555555' || tin === '66666666666666' || tin === '77777777777777' || tin === '88888888888888' || tin === '99999999999999') {
    return false;
  }
  var length = tin.length - 2;
  var identifiers = tin.substring(0, length);
  var verificators = tin.substring(length);
  var sum = 0;
  var pos = length - 7;
  for (var _i9 = length; _i9 >= 1; _i9--) {
    sum += identifiers.charAt(length - _i9) * pos;
    pos -= 1;
    if (pos < 2) {
      pos = 9;
    }
  }
  var result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(verificators.charAt(0), 10)) {
    return false;
  }
  length += 1;
  identifiers = tin.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (var _i10 = length; _i10 >= 1; _i10--) {
    sum += identifiers.charAt(length - _i10) * pos;
    pos -= 1;
    if (pos < 2) {
      pos = 9;
    }
  }
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(verificators.charAt(1), 10)) {
    return false;
  }
  return true;
}

/*
 * pt-PT validation function
 * (Número de identificação fiscal (NIF), persons/entities)
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */
function ptPtCheck(tin) {
  var checksum = 11 - algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 8).map(function (a) {
    return parseInt(a, 10);
  }), 9) % 11;
  if (checksum > 9) {
    return parseInt(tin[8], 10) === 0;
  }
  return checksum === parseInt(tin[8], 10);
}

/*
 * ro-RO validation function
 * (Cod Numeric Personal (CNP) or Cod de înregistrare fiscală (CIF),
 * persons only)
 * Verify CNP validity by calculating check (last) digit (test not found for CIF)
 * Material not in DG TAXUD document sourced from:
 * `https://en.wikipedia.org/wiki/National_identification_number#Romania`
 */
function roRoCheck(tin) {
  if (tin.slice(0, 4) !== '9000') {
    // No test found for this format
    // Extract full year using century digit if possible
    var full_year = tin.slice(1, 3);
    switch (tin[0]) {
      case '1':
      case '2':
        full_year = "19".concat(full_year);
        break;
      case '3':
      case '4':
        full_year = "18".concat(full_year);
        break;
      case '5':
      case '6':
        full_year = "20".concat(full_year);
        break;
      default:
    }

    // Check date validity
    var date = "".concat(full_year, "/").concat(tin.slice(3, 5), "/").concat(tin.slice(5, 7));
    if (date.length === 8) {
      if (!(0, _isDate.default)(date, 'YY/MM/DD')) {
        return false;
      }
    } else if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
      return false;
    }

    // Calculate check digit
    var digits = tin.split('').map(function (a) {
      return parseInt(a, 10);
    });
    var multipliers = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    var checksum = 0;
    for (var i = 0; i < multipliers.length; i++) {
      checksum += digits[i] * multipliers[i];
    }
    if (checksum % 11 === 10) {
      return digits[12] === 1;
    }
    return digits[12] === checksum % 11;
  }
  return true;
}

/*
 * sk-SK validation function
 * (Rodné číslo (RČ) or bezvýznamové identifikačné číslo (BIČ), persons only)
 * Checks validity of pre-1954 birth numbers (rodné číslo) only
 * Due to the introduction of the pseudo-random BIČ it is not possible to test
 * post-1954 birth numbers without knowing whether they are BIČ or RČ beforehand
 */
function skSkCheck(tin) {
  if (tin.length === 9) {
    tin = tin.replace(/\W/, '');
    if (tin.slice(6) === '000') {
      return false;
    } // Three-zero serial not assigned before 1954

    // Extract full year from TIN length
    var full_year = parseInt(tin.slice(0, 2), 10);
    if (full_year > 53) {
      return false;
    }
    if (full_year < 10) {
      full_year = "190".concat(full_year);
    } else {
      full_year = "19".concat(full_year);
    }

    // Extract month from TIN and normalize
    var month = parseInt(tin.slice(2, 4), 10);
    if (month > 50) {
      month -= 50;
    }
    if (month < 10) {
      month = "0".concat(month);
    }

    // Check date validity
    var date = "".concat(full_year, "/").concat(month, "/").concat(tin.slice(4, 6));
    if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
      return false;
    }
  }
  return true;
}

/*
 * sl-SI validation function
 * (Davčna številka, persons/entities)
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */
function slSiCheck(tin) {
  var checksum = 11 - algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 7).map(function (a) {
    return parseInt(a, 10);
  }), 8) % 11;
  if (checksum === 10) {
    return parseInt(tin[7], 10) === 0;
  }
  return checksum === parseInt(tin[7], 10);
}

/*
 * sv-SE validation function
 * (Personnummer or samordningsnummer, persons only)
 * Checks validity of birth date and calls luhnCheck() to validate check (last) digit
 */
function svSeCheck(tin) {
  // Make copy of TIN and normalize to two-digit year form
  var tin_copy = tin.slice(0);
  if (tin.length > 11) {
    tin_copy = tin_copy.slice(2);
  }

  // Extract date of birth
  var full_year = '';
  var month = tin_copy.slice(2, 4);
  var day = parseInt(tin_copy.slice(4, 6), 10);
  if (tin.length > 11) {
    full_year = tin.slice(0, 4);
  } else {
    full_year = tin.slice(0, 2);
    if (tin.length === 11 && day < 60) {
      // Extract full year from centenarian symbol
      // Should work just fine until year 10000 or so
      var current_year = new Date().getFullYear().toString();
      var current_century = parseInt(current_year.slice(0, 2), 10);
      current_year = parseInt(current_year, 10);
      if (tin[6] === '-') {
        if (parseInt("".concat(current_century).concat(full_year), 10) > current_year) {
          full_year = "".concat(current_century - 1).concat(full_year);
        } else {
          full_year = "".concat(current_century).concat(full_year);
        }
      } else {
        full_year = "".concat(current_century - 1).concat(full_year);
        if (current_year - parseInt(full_year, 10) < 100) {
          return false;
        }
      }
    }
  }

  // Normalize day and check date validity
  if (day > 60) {
    day -= 60;
  }
  if (day < 10) {
    day = "0".concat(day);
  }
  var date = "".concat(full_year, "/").concat(month, "/").concat(day);
  if (date.length === 8) {
    if (!(0, _isDate.default)(date, 'YY/MM/DD')) {
      return false;
    }
  } else if (!(0, _isDate.default)(date, 'YYYY/MM/DD')) {
    return false;
  }
  return algorithms.luhnCheck(tin.replace(/\W/, ''));
}

/**
 * uk-UA validation function
 * Verify TIN validity by calculating check (last) digit (variant of MOD 11)
 */
function ukUaCheck(tin) {
  // Calculate check digit
  var digits = tin.split('').map(function (a) {
    return parseInt(a, 10);
  });
  var multipliers = [-1, 5, 7, 9, 4, 6, 10, 5, 7];
  var checksum = 0;
  for (var i = 0; i < multipliers.length; i++) {
    checksum += digits[i] * multipliers[i];
  }
  return checksum % 11 === 10 ? digits[9] === 0 : digits[9] === checksum % 11;
}

// Locale lookup objects

/*
 * Tax id regex formats for various locales
 *
 * Where not explicitly specified in DG-TAXUD document both
 * uppercase and lowercase letters are acceptable.
 */
var taxIdFormat = {
  'bg-BG': /^\d{10}$/,
  'cs-CZ': /^\d{6}\/{0,1}\d{3,4}$/,
  'de-AT': /^\d{9}$/,
  'de-DE': /^[1-9]\d{10}$/,
  'dk-DK': /^\d{6}-{0,1}\d{4}$/,
  'el-CY': /^[09]\d{7}[A-Z]$/,
  'el-GR': /^([0-4]|[7-9])\d{8}$/,
  'en-CA': /^\d{9}$/,
  'en-GB': /^\d{10}$|^(?!GB|NK|TN|ZZ)(?![DFIQUV])[A-Z](?![DFIQUVO])[A-Z]\d{6}[ABCD ]$/i,
  'en-IE': /^\d{7}[A-W][A-IW]{0,1}$/i,
  'en-US': /^\d{2}[- ]{0,1}\d{7}$/,
  'es-AR': /(20|23|24|27|30|33|34)[0-9]{8}[0-9]/,
  'es-ES': /^(\d{0,8}|[XYZKLM]\d{7})[A-HJ-NP-TV-Z]$/i,
  'et-EE': /^[1-6]\d{6}(00[1-9]|0[1-9][0-9]|[1-6][0-9]{2}|70[0-9]|710)\d$/,
  'fi-FI': /^\d{6}[-+A]\d{3}[0-9A-FHJ-NPR-Y]$/i,
  'fr-BE': /^\d{11}$/,
  'fr-FR': /^[0-3]\d{12}$|^[0-3]\d\s\d{2}(\s\d{3}){3}$/,
  // Conforms both to official spec and provided example
  'fr-LU': /^\d{13}$/,
  'hr-HR': /^\d{11}$/,
  'hu-HU': /^8\d{9}$/,
  'it-IT': /^[A-Z]{6}[L-NP-V0-9]{2}[A-EHLMPRST][L-NP-V0-9]{2}[A-ILMZ][L-NP-V0-9]{3}[A-Z]$/i,
  'lv-LV': /^\d{6}-{0,1}\d{5}$/,
  // Conforms both to DG TAXUD spec and original research
  'mt-MT': /^\d{3,7}[APMGLHBZ]$|^([1-8])\1\d{7}$/i,
  'nl-NL': /^\d{9}$/,
  'pl-PL': /^\d{10,11}$/,
  'pt-BR': /(?:^\d{11}$)|(?:^\d{14}$)/,
  'pt-PT': /^\d{9}$/,
  'ro-RO': /^\d{13}$/,
  'sk-SK': /^\d{6}\/{0,1}\d{3,4}$/,
  'sl-SI': /^[1-9]\d{7}$/,
  'sv-SE': /^(\d{6}[-+]{0,1}\d{4}|(18|19|20)\d{6}[-+]{0,1}\d{4})$/,
  'uk-UA': /^\d{10}$/
};
// taxIdFormat locale aliases
taxIdFormat['lb-LU'] = taxIdFormat['fr-LU'];
taxIdFormat['lt-LT'] = taxIdFormat['et-EE'];
taxIdFormat['nl-BE'] = taxIdFormat['fr-BE'];
taxIdFormat['fr-CA'] = taxIdFormat['en-CA'];

// Algorithmic tax id check functions for various locales
var taxIdCheck = {
  'bg-BG': bgBgCheck,
  'cs-CZ': csCzCheck,
  'de-AT': deAtCheck,
  'de-DE': deDeCheck,
  'dk-DK': dkDkCheck,
  'el-CY': elCyCheck,
  'el-GR': elGrCheck,
  'en-CA': isCanadianSIN,
  'en-IE': enIeCheck,
  'en-US': enUsCheck,
  'es-AR': esArCheck,
  'es-ES': esEsCheck,
  'et-EE': etEeCheck,
  'fi-FI': fiFiCheck,
  'fr-BE': frBeCheck,
  'fr-FR': frFrCheck,
  'fr-LU': frLuCheck,
  'hr-HR': hrHrCheck,
  'hu-HU': huHuCheck,
  'it-IT': itItCheck,
  'lv-LV': lvLvCheck,
  'mt-MT': mtMtCheck,
  'nl-NL': nlNlCheck,
  'pl-PL': plPlCheck,
  'pt-BR': ptBrCheck,
  'pt-PT': ptPtCheck,
  'ro-RO': roRoCheck,
  'sk-SK': skSkCheck,
  'sl-SI': slSiCheck,
  'sv-SE': svSeCheck,
  'uk-UA': ukUaCheck
};
// taxIdCheck locale aliases
taxIdCheck['lb-LU'] = taxIdCheck['fr-LU'];
taxIdCheck['lt-LT'] = taxIdCheck['et-EE'];
taxIdCheck['nl-BE'] = taxIdCheck['fr-BE'];
taxIdCheck['fr-CA'] = taxIdCheck['en-CA'];

// Regexes for locales where characters should be omitted before checking format
var allsymbols = /[-\\\/!@#$%\^&\*\(\)\+\=\[\]]+/g;
var sanitizeRegexes = {
  'de-AT': allsymbols,
  'de-DE': /[\/\\]/g,
  'fr-BE': allsymbols
};
// sanitizeRegexes locale aliases
sanitizeRegexes['nl-BE'] = sanitizeRegexes['fr-BE'];

/*
 * Validator function
 * Return true if the passed string is a valid tax identification number
 * for the specified locale.
 * Throw an error exception if the locale is not supported.
 */
function isTaxID(str) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'en-US';
  (0, _assertString.default)(str);
  // Copy TIN to avoid replacement if sanitized
  var strcopy = str.slice(0);
  if (locale in taxIdFormat) {
    if (locale in sanitizeRegexes) {
      strcopy = strcopy.replace(sanitizeRegexes[locale], '');
    }
    if (!taxIdFormat[locale].test(strcopy)) {
      return false;
    }
    if (locale in taxIdCheck) {
      return taxIdCheck[locale](strcopy);
    }
    // Fallthrough; not all locales have algorithmic checks
    return true;
  }
  throw new Error("Invalid locale '".concat(locale, "'"));
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isTime.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isTime.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isTime;
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var default_time_options = {
  hourFormat: 'hour24',
  mode: 'default'
};
var formats = {
  hour24: {
    default: /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/,
    withSeconds: /^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/
  },
  hour12: {
    default: /^(0?[1-9]|1[0-2]):([0-5][0-9]) (A|P)M$/,
    withSeconds: /^(0?[1-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (A|P)M$/
  }
};
function isTime(input, options) {
  options = (0, _merge.default)(options, default_time_options);
  if (typeof input !== 'string') return false;
  return formats[options.hourFormat][options.mode].test(input);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isURL.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isURL.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isURL;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _isFQDN = _interopRequireDefault(__webpack_require__(/*! ./isFQDN */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFQDN.js"));
var _isIP = _interopRequireDefault(__webpack_require__(/*! ./isIP */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isIP.js"));
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/*
options for isURL method

require_protocol - if set as true isURL will return false if protocol is not present in the URL
require_valid_protocol - isURL will check if the URL's protocol is present in the protocols option
protocols - valid protocols can be modified with this option
require_host - if set as false isURL will not check if host is present in the URL
require_port - if set as true isURL will check if port is present in the URL
allow_protocol_relative_urls - if set as true protocol relative URLs will be allowed
validate_length - if set as false isURL will skip string length validation (IE maximum is 2083)

*/

var default_url_options = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_port: false,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  allow_fragments: true,
  allow_query_components: true,
  validate_length: true
};
var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;
function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}
function checkHost(host, matches) {
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];
    if (host === match || isRegExp(match) && match.test(host)) {
      return true;
    }
  }
  return false;
}
function isURL(url, options) {
  (0, _assertString.default)(url);
  if (!url || /[\s<>]/.test(url)) {
    return false;
  }
  if (url.indexOf('mailto:') === 0) {
    return false;
  }
  options = (0, _merge.default)(options, default_url_options);
  if (options.validate_length && url.length >= 2083) {
    return false;
  }
  if (!options.allow_fragments && url.includes('#')) {
    return false;
  }
  if (!options.allow_query_components && (url.includes('?') || url.includes('&'))) {
    return false;
  }
  var protocol, auth, host, hostname, port, port_str, split, ipv6;
  split = url.split('#');
  url = split.shift();
  split = url.split('?');
  url = split.shift();
  split = url.split('://');
  if (split.length > 1) {
    protocol = split.shift().toLowerCase();
    if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
      return false;
    }
  } else if (options.require_protocol) {
    return false;
  } else if (url.slice(0, 2) === '//') {
    if (!options.allow_protocol_relative_urls) {
      return false;
    }
    split[0] = url.slice(2);
  }
  url = split.join('://');
  if (url === '') {
    return false;
  }
  split = url.split('/');
  url = split.shift();
  if (url === '' && !options.require_host) {
    return true;
  }
  split = url.split('@');
  if (split.length > 1) {
    if (options.disallow_auth) {
      return false;
    }
    if (split[0] === '') {
      return false;
    }
    auth = split.shift();
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }
    var _auth$split = auth.split(':'),
      _auth$split2 = _slicedToArray(_auth$split, 2),
      user = _auth$split2[0],
      password = _auth$split2[1];
    if (user === '' && password === '') {
      return false;
    }
  }
  hostname = split.join('@');
  port_str = null;
  ipv6 = null;
  var ipv6_match = hostname.match(wrapped_ipv6);
  if (ipv6_match) {
    host = '';
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(':');
    host = split.shift();
    if (split.length) {
      port_str = split.join(':');
    }
  }
  if (port_str !== null && port_str.length > 0) {
    port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  } else if (options.require_port) {
    return false;
  }
  if (options.host_whitelist) {
    return checkHost(host, options.host_whitelist);
  }
  if (host === '' && !options.require_host) {
    return true;
  }
  if (!(0, _isIP.default)(host) && !(0, _isFQDN.default)(host, options) && (!ipv6 || !(0, _isIP.default)(ipv6, 6))) {
    return false;
  }
  host = host || ipv6;
  if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
    return false;
  }
  return true;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isUUID.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isUUID.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isUUID;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var uuid = {
  1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  7: /^[0-9A-F]{8}-[0-9A-F]{4}-7[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};
function isUUID(str, version) {
  (0, _assertString.default)(str);
  var pattern = uuid[![undefined, null].includes(version) ? version : 'all'];
  return !!pattern && pattern.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isUppercase.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isUppercase.js ***!
  \****************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isUppercase;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isUppercase(str) {
  (0, _assertString.default)(str);
  return str === str.toUpperCase();
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isVAT.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isVAT.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isVAT;
exports.vatMatchers = void 0;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var algorithms = _interopRequireWildcard(__webpack_require__(/*! ./util/algorithms */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/algorithms.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var AU = function AU(str) {
  var match = str.match(/^(AU)?(\d{11})$/);
  if (!match) {
    return false;
  }
  // @see {@link https://abr.business.gov.au/Help/AbnFormat}
  var weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  str = str.replace(/^AU/, '');
  var ABN = (parseInt(str.slice(0, 1), 10) - 1).toString() + str.slice(1);
  var total = 0;
  for (var i = 0; i < 11; i++) {
    total += weights[i] * ABN.charAt(i);
  }
  return total !== 0 && total % 89 === 0;
};
var CH = function CH(str) {
  // @see {@link https://www.ech.ch/de/ech/ech-0097/5.2.0}
  var hasValidCheckNumber = function hasValidCheckNumber(digits) {
    var lastDigit = digits.pop(); // used as check number
    var weights = [5, 4, 3, 2, 7, 6, 5, 4];
    var calculatedCheckNumber = (11 - digits.reduce(function (acc, el, idx) {
      return acc + el * weights[idx];
    }, 0) % 11) % 11;
    return lastDigit === calculatedCheckNumber;
  };

  // @see {@link https://www.estv.admin.ch/estv/de/home/mehrwertsteuer/uid/mwst-uid-nummer.html}
  return /^(CHE[- ]?)?(\d{9}|(\d{3}\.\d{3}\.\d{3})|(\d{3} \d{3} \d{3})) ?(TVA|MWST|IVA)?$/.test(str) && hasValidCheckNumber(str.match(/\d/g).map(function (el) {
    return +el;
  }));
};
var PT = function PT(str) {
  var match = str.match(/^(PT)?(\d{9})$/);
  if (!match) {
    return false;
  }
  var tin = match[2];
  var checksum = 11 - algorithms.reverseMultiplyAndSum(tin.split('').slice(0, 8).map(function (a) {
    return parseInt(a, 10);
  }), 9) % 11;
  if (checksum > 9) {
    return parseInt(tin[8], 10) === 0;
  }
  return checksum === parseInt(tin[8], 10);
};
var vatMatchers = exports.vatMatchers = {
  /**
   * European Union VAT identification numbers
   */
  AT: function AT(str) {
    return /^(AT)?U\d{8}$/.test(str);
  },
  BE: function BE(str) {
    return /^(BE)?\d{10}$/.test(str);
  },
  BG: function BG(str) {
    return /^(BG)?\d{9,10}$/.test(str);
  },
  HR: function HR(str) {
    return /^(HR)?\d{11}$/.test(str);
  },
  CY: function CY(str) {
    return /^(CY)?\w{9}$/.test(str);
  },
  CZ: function CZ(str) {
    return /^(CZ)?\d{8,10}$/.test(str);
  },
  DK: function DK(str) {
    return /^(DK)?\d{8}$/.test(str);
  },
  EE: function EE(str) {
    return /^(EE)?\d{9}$/.test(str);
  },
  FI: function FI(str) {
    return /^(FI)?\d{8}$/.test(str);
  },
  FR: function FR(str) {
    return /^(FR)?\w{2}\d{9}$/.test(str);
  },
  DE: function DE(str) {
    return /^(DE)?\d{9}$/.test(str);
  },
  EL: function EL(str) {
    return /^(EL)?\d{9}$/.test(str);
  },
  HU: function HU(str) {
    return /^(HU)?\d{8}$/.test(str);
  },
  IE: function IE(str) {
    return /^(IE)?\d{7}\w{1}(W)?$/.test(str);
  },
  IT: function IT(str) {
    return /^(IT)?\d{11}$/.test(str);
  },
  LV: function LV(str) {
    return /^(LV)?\d{11}$/.test(str);
  },
  LT: function LT(str) {
    return /^(LT)?\d{9,12}$/.test(str);
  },
  LU: function LU(str) {
    return /^(LU)?\d{8}$/.test(str);
  },
  MT: function MT(str) {
    return /^(MT)?\d{8}$/.test(str);
  },
  NL: function NL(str) {
    return /^(NL)?\d{9}B\d{2}$/.test(str);
  },
  PL: function PL(str) {
    return /^(PL)?(\d{10}|(\d{3}-\d{3}-\d{2}-\d{2})|(\d{3}-\d{2}-\d{2}-\d{3}))$/.test(str);
  },
  PT: PT,
  RO: function RO(str) {
    return /^(RO)?\d{2,10}$/.test(str);
  },
  SK: function SK(str) {
    return /^(SK)?\d{10}$/.test(str);
  },
  SI: function SI(str) {
    return /^(SI)?\d{8}$/.test(str);
  },
  ES: function ES(str) {
    return /^(ES)?\w\d{7}[A-Z]$/.test(str);
  },
  SE: function SE(str) {
    return /^(SE)?\d{12}$/.test(str);
  },
  /**
   * VAT numbers of non-EU countries
   */
  AL: function AL(str) {
    return /^(AL)?\w{9}[A-Z]$/.test(str);
  },
  MK: function MK(str) {
    return /^(MK)?\d{13}$/.test(str);
  },
  AU: AU,
  BY: function BY(str) {
    return /^(УНП )?\d{9}$/.test(str);
  },
  CA: function CA(str) {
    return /^(CA)?\d{9}$/.test(str);
  },
  IS: function IS(str) {
    return /^(IS)?\d{5,6}$/.test(str);
  },
  IN: function IN(str) {
    return /^(IN)?\d{15}$/.test(str);
  },
  ID: function ID(str) {
    return /^(ID)?(\d{15}|(\d{2}.\d{3}.\d{3}.\d{1}-\d{3}.\d{3}))$/.test(str);
  },
  IL: function IL(str) {
    return /^(IL)?\d{9}$/.test(str);
  },
  KZ: function KZ(str) {
    return /^(KZ)?\d{12}$/.test(str);
  },
  NZ: function NZ(str) {
    return /^(NZ)?\d{9}$/.test(str);
  },
  NG: function NG(str) {
    return /^(NG)?(\d{12}|(\d{8}-\d{4}))$/.test(str);
  },
  NO: function NO(str) {
    return /^(NO)?\d{9}MVA$/.test(str);
  },
  PH: function PH(str) {
    return /^(PH)?(\d{12}|\d{3} \d{3} \d{3} \d{3})$/.test(str);
  },
  RU: function RU(str) {
    return /^(RU)?(\d{10}|\d{12})$/.test(str);
  },
  SM: function SM(str) {
    return /^(SM)?\d{5}$/.test(str);
  },
  SA: function SA(str) {
    return /^(SA)?\d{15}$/.test(str);
  },
  RS: function RS(str) {
    return /^(RS)?\d{9}$/.test(str);
  },
  CH: CH,
  TR: function TR(str) {
    return /^(TR)?\d{10}$/.test(str);
  },
  UA: function UA(str) {
    return /^(UA)?\d{12}$/.test(str);
  },
  GB: function GB(str) {
    return /^GB((\d{3} \d{4} ([0-8][0-9]|9[0-6]))|(\d{9} \d{3})|(((GD[0-4])|(HA[5-9]))[0-9]{2}))$/.test(str);
  },
  UZ: function UZ(str) {
    return /^(UZ)?\d{9}$/.test(str);
  },
  /**
   * VAT numbers of Latin American countries
   */
  AR: function AR(str) {
    return /^(AR)?\d{11}$/.test(str);
  },
  BO: function BO(str) {
    return /^(BO)?\d{7}$/.test(str);
  },
  BR: function BR(str) {
    return /^(BR)?((\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})|(\d{3}.\d{3}.\d{3}-\d{2}))$/.test(str);
  },
  CL: function CL(str) {
    return /^(CL)?\d{8}-\d{1}$/.test(str);
  },
  CO: function CO(str) {
    return /^(CO)?\d{10}$/.test(str);
  },
  CR: function CR(str) {
    return /^(CR)?\d{9,12}$/.test(str);
  },
  EC: function EC(str) {
    return /^(EC)?\d{13}$/.test(str);
  },
  SV: function SV(str) {
    return /^(SV)?\d{4}-\d{6}-\d{3}-\d{1}$/.test(str);
  },
  GT: function GT(str) {
    return /^(GT)?\d{7}-\d{1}$/.test(str);
  },
  HN: function HN(str) {
    return /^(HN)?$/.test(str);
  },
  MX: function MX(str) {
    return /^(MX)?\w{3,4}\d{6}\w{3}$/.test(str);
  },
  NI: function NI(str) {
    return /^(NI)?\d{3}-\d{6}-\d{4}\w{1}$/.test(str);
  },
  PA: function PA(str) {
    return /^(PA)?$/.test(str);
  },
  PY: function PY(str) {
    return /^(PY)?\d{6,8}-\d{1}$/.test(str);
  },
  PE: function PE(str) {
    return /^(PE)?\d{11}$/.test(str);
  },
  DO: function DO(str) {
    return /^(DO)?(\d{11}|(\d{3}-\d{7}-\d{1})|[1,4,5]{1}\d{8}|([1,4,5]{1})-\d{2}-\d{5}-\d{1})$/.test(str);
  },
  UY: function UY(str) {
    return /^(UY)?\d{12}$/.test(str);
  },
  VE: function VE(str) {
    return /^(VE)?[J,G,V,E]{1}-(\d{9}|(\d{8}-\d{1}))$/.test(str);
  }
};
function isVAT(str, countryCode) {
  (0, _assertString.default)(str);
  (0, _assertString.default)(countryCode);
  if (countryCode in vatMatchers) {
    return vatMatchers[countryCode](str);
  }
  throw new Error("Invalid country code: '".concat(countryCode, "'"));
}

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isVariableWidth.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isVariableWidth.js ***!
  \********************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isVariableWidth;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _isFullWidth = __webpack_require__(/*! ./isFullWidth */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFullWidth.js");
var _isHalfWidth = __webpack_require__(/*! ./isHalfWidth */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isHalfWidth.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isVariableWidth(str) {
  (0, _assertString.default)(str);
  return _isFullWidth.fullWidth.test(str) && _isHalfWidth.halfWidth.test(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isWhitelisted.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isWhitelisted.js ***!
  \******************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = isWhitelisted;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function isWhitelisted(str, chars) {
  (0, _assertString.default)(str);
  for (var i = str.length - 1; i >= 0; i--) {
    if (chars.indexOf(str[i]) === -1) {
      return false;
    }
  }
  return true;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/ltrim.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/ltrim.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = ltrim;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ltrim(str, chars) {
  (0, _assertString.default)(str);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
  var pattern = chars ? new RegExp("^[".concat(chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "]+"), 'g') : /^\s+/g;
  return str.replace(pattern, '');
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/matches.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/matches.js ***!
  \************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = matches;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function matches(str, pattern, modifiers) {
  (0, _assertString.default)(str);
  if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
    pattern = new RegExp(pattern, modifiers);
  }
  return !!str.match(pattern);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/normalizeEmail.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/normalizeEmail.js ***!
  \*******************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = normalizeEmail;
var _merge = _interopRequireDefault(__webpack_require__(/*! ./util/merge */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var default_normalize_email_options = {
  // The following options apply to all email addresses
  // Lowercases the local part of the email address.
  // Please note this may violate RFC 5321 as per http://stackoverflow.com/a/9808332/192024).
  // The domain is always lowercased, as per RFC 1035
  all_lowercase: true,
  // The following conversions are specific to GMail
  // Lowercases the local part of the GMail address (known to be case-insensitive)
  gmail_lowercase: true,
  // Removes dots from the local part of the email address, as that's ignored by GMail
  gmail_remove_dots: true,
  // Removes the subaddress (e.g. "+foo") from the email address
  gmail_remove_subaddress: true,
  // Conversts the googlemail.com domain to gmail.com
  gmail_convert_googlemaildotcom: true,
  // The following conversions are specific to Outlook.com / Windows Live / Hotmail
  // Lowercases the local part of the Outlook.com address (known to be case-insensitive)
  outlookdotcom_lowercase: true,
  // Removes the subaddress (e.g. "+foo") from the email address
  outlookdotcom_remove_subaddress: true,
  // The following conversions are specific to Yahoo
  // Lowercases the local part of the Yahoo address (known to be case-insensitive)
  yahoo_lowercase: true,
  // Removes the subaddress (e.g. "-foo") from the email address
  yahoo_remove_subaddress: true,
  // The following conversions are specific to Yandex
  // Lowercases the local part of the Yandex address (known to be case-insensitive)
  yandex_lowercase: true,
  // The following conversions are specific to iCloud
  // Lowercases the local part of the iCloud address (known to be case-insensitive)
  icloud_lowercase: true,
  // Removes the subaddress (e.g. "+foo") from the email address
  icloud_remove_subaddress: true
};

// List of domains used by iCloud
var icloud_domains = ['icloud.com', 'me.com'];

// List of domains used by Outlook.com and its predecessors
// This list is likely incomplete.
// Partial reference:
// https://blogs.office.com/2013/04/17/outlook-com-gets-two-step-verification-sign-in-by-alias-and-new-international-domains/
var outlookdotcom_domains = ['hotmail.at', 'hotmail.be', 'hotmail.ca', 'hotmail.cl', 'hotmail.co.il', 'hotmail.co.nz', 'hotmail.co.th', 'hotmail.co.uk', 'hotmail.com', 'hotmail.com.ar', 'hotmail.com.au', 'hotmail.com.br', 'hotmail.com.gr', 'hotmail.com.mx', 'hotmail.com.pe', 'hotmail.com.tr', 'hotmail.com.vn', 'hotmail.cz', 'hotmail.de', 'hotmail.dk', 'hotmail.es', 'hotmail.fr', 'hotmail.hu', 'hotmail.id', 'hotmail.ie', 'hotmail.in', 'hotmail.it', 'hotmail.jp', 'hotmail.kr', 'hotmail.lv', 'hotmail.my', 'hotmail.ph', 'hotmail.pt', 'hotmail.sa', 'hotmail.sg', 'hotmail.sk', 'live.be', 'live.co.uk', 'live.com', 'live.com.ar', 'live.com.mx', 'live.de', 'live.es', 'live.eu', 'live.fr', 'live.it', 'live.nl', 'msn.com', 'outlook.at', 'outlook.be', 'outlook.cl', 'outlook.co.il', 'outlook.co.nz', 'outlook.co.th', 'outlook.com', 'outlook.com.ar', 'outlook.com.au', 'outlook.com.br', 'outlook.com.gr', 'outlook.com.pe', 'outlook.com.tr', 'outlook.com.vn', 'outlook.cz', 'outlook.de', 'outlook.dk', 'outlook.es', 'outlook.fr', 'outlook.hu', 'outlook.id', 'outlook.ie', 'outlook.in', 'outlook.it', 'outlook.jp', 'outlook.kr', 'outlook.lv', 'outlook.my', 'outlook.ph', 'outlook.pt', 'outlook.sa', 'outlook.sg', 'outlook.sk', 'passport.com'];

// List of domains used by Yahoo Mail
// This list is likely incomplete
var yahoo_domains = ['rocketmail.com', 'yahoo.ca', 'yahoo.co.uk', 'yahoo.com', 'yahoo.de', 'yahoo.fr', 'yahoo.in', 'yahoo.it', 'ymail.com'];

// List of domains used by yandex.ru
var yandex_domains = ['yandex.ru', 'yandex.ua', 'yandex.kz', 'yandex.com', 'yandex.by', 'ya.ru'];

// replace single dots, but not multiple consecutive dots
function dotsReplacer(match) {
  if (match.length > 1) {
    return match;
  }
  return '';
}
function normalizeEmail(email, options) {
  options = (0, _merge.default)(options, default_normalize_email_options);
  var raw_parts = email.split('@');
  var domain = raw_parts.pop();
  var user = raw_parts.join('@');
  var parts = [user, domain];

  // The domain is always lowercased, as it's case-insensitive per RFC 1035
  parts[1] = parts[1].toLowerCase();
  if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
    // Address is GMail
    if (options.gmail_remove_subaddress) {
      parts[0] = parts[0].split('+')[0];
    }
    if (options.gmail_remove_dots) {
      // this does not replace consecutive dots like example..email@gmail.com
      parts[0] = parts[0].replace(/\.+/g, dotsReplacer);
    }
    if (!parts[0].length) {
      return false;
    }
    if (options.all_lowercase || options.gmail_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
    parts[1] = options.gmail_convert_googlemaildotcom ? 'gmail.com' : parts[1];
  } else if (icloud_domains.indexOf(parts[1]) >= 0) {
    // Address is iCloud
    if (options.icloud_remove_subaddress) {
      parts[0] = parts[0].split('+')[0];
    }
    if (!parts[0].length) {
      return false;
    }
    if (options.all_lowercase || options.icloud_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  } else if (outlookdotcom_domains.indexOf(parts[1]) >= 0) {
    // Address is Outlook.com
    if (options.outlookdotcom_remove_subaddress) {
      parts[0] = parts[0].split('+')[0];
    }
    if (!parts[0].length) {
      return false;
    }
    if (options.all_lowercase || options.outlookdotcom_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  } else if (yahoo_domains.indexOf(parts[1]) >= 0) {
    // Address is Yahoo
    if (options.yahoo_remove_subaddress) {
      var components = parts[0].split('-');
      parts[0] = components.length > 1 ? components.slice(0, -1).join('-') : components[0];
    }
    if (!parts[0].length) {
      return false;
    }
    if (options.all_lowercase || options.yahoo_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
  } else if (yandex_domains.indexOf(parts[1]) >= 0) {
    if (options.all_lowercase || options.yandex_lowercase) {
      parts[0] = parts[0].toLowerCase();
    }
    parts[1] = 'yandex.ru'; // all yandex domains are equal, 1st preferred
  } else if (options.all_lowercase) {
    // Any other address
    parts[0] = parts[0].toLowerCase();
  }
  return parts.join('@');
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/rtrim.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/rtrim.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rtrim;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function rtrim(str, chars) {
  (0, _assertString.default)(str);
  if (chars) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    var pattern = new RegExp("[".concat(chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "]+$"), 'g');
    return str.replace(pattern, '');
  }
  // Use a faster and more safe than regex trim method https://blog.stevenlevithan.com/archives/faster-trim-javascript
  var strIndex = str.length - 1;
  while (/\s/.test(str.charAt(strIndex))) {
    strIndex -= 1;
  }
  return str.slice(0, strIndex + 1);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/stripLow.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/stripLow.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = stripLow;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
var _blacklist = _interopRequireDefault(__webpack_require__(/*! ./blacklist */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/blacklist.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function stripLow(str, keep_new_lines) {
  (0, _assertString.default)(str);
  var chars = keep_new_lines ? '\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F' : '\\x00-\\x1F\\x7F';
  return (0, _blacklist.default)(str, chars);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toBoolean.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toBoolean.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toBoolean;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function toBoolean(str, strict) {
  (0, _assertString.default)(str);
  if (strict) {
    return str === '1' || /^true$/i.test(str);
  }
  return str !== '0' && !/^false$/i.test(str) && str !== '';
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toDate.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toDate.js ***!
  \***********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toDate;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function toDate(date) {
  (0, _assertString.default)(date);
  date = Date.parse(date);
  return !isNaN(date) ? new Date(date) : null;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toFloat.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toFloat.js ***!
  \************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toFloat;
var _isFloat = _interopRequireDefault(__webpack_require__(/*! ./isFloat */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/isFloat.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function toFloat(str) {
  if (!(0, _isFloat.default)(str)) return NaN;
  return parseFloat(str);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toInt.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/toInt.js ***!
  \**********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toInt;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function toInt(str, radix) {
  (0, _assertString.default)(str);
  return parseInt(str, radix || 10);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/trim.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/trim.js ***!
  \*********************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = trim;
var _rtrim = _interopRequireDefault(__webpack_require__(/*! ./rtrim */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/rtrim.js"));
var _ltrim = _interopRequireDefault(__webpack_require__(/*! ./ltrim */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/ltrim.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function trim(str, chars) {
  return (0, _rtrim.default)((0, _ltrim.default)(str, chars), chars);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/unescape.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/unescape.js ***!
  \*************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = unescape;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function unescape(str) {
  (0, _assertString.default)(str);
  return str.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/').replace(/&#x5C;/g, '\\').replace(/&#96;/g, '`').replace(/&amp;/g, '&');
  // &amp; replacement has to be the last one to prevent
  // bugs with intermediate strings containing escape sequences
  // See: https://github.com/validatorjs/validator.js/issues/1827
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/algorithms.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/algorithms.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.iso7064Check = iso7064Check;
exports.luhnCheck = luhnCheck;
exports.reverseMultiplyAndSum = reverseMultiplyAndSum;
exports.verhoeffCheck = verhoeffCheck;
/**
 * Algorithmic validation functions
 * May be used as is or implemented in the workflow of other validators.
 */

/*
 * ISO 7064 validation function
 * Called with a string of numbers (incl. check digit)
 * to validate according to ISO 7064 (MOD 11, 10).
 */
function iso7064Check(str) {
  var checkvalue = 10;
  for (var i = 0; i < str.length - 1; i++) {
    checkvalue = (parseInt(str[i], 10) + checkvalue) % 10 === 0 ? 10 * 2 % 11 : (parseInt(str[i], 10) + checkvalue) % 10 * 2 % 11;
  }
  checkvalue = checkvalue === 1 ? 0 : 11 - checkvalue;
  return checkvalue === parseInt(str[10], 10);
}

/*
 * Luhn (mod 10) validation function
 * Called with a string of numbers (incl. check digit)
 * to validate according to the Luhn algorithm.
 */
function luhnCheck(str) {
  var checksum = 0;
  var second = false;
  for (var i = str.length - 1; i >= 0; i--) {
    if (second) {
      var product = parseInt(str[i], 10) * 2;
      if (product > 9) {
        // sum digits of product and add to checksum
        checksum += product.toString().split('').map(function (a) {
          return parseInt(a, 10);
        }).reduce(function (a, b) {
          return a + b;
        }, 0);
      } else {
        checksum += product;
      }
    } else {
      checksum += parseInt(str[i], 10);
    }
    second = !second;
  }
  return checksum % 10 === 0;
}

/*
 * Reverse TIN multiplication and summation helper function
 * Called with an array of single-digit integers and a base multiplier
 * to calculate the sum of the digits multiplied in reverse.
 * Normally used in variations of MOD 11 algorithmic checks.
 */
function reverseMultiplyAndSum(digits, base) {
  var total = 0;
  for (var i = 0; i < digits.length; i++) {
    total += digits[i] * (base - i);
  }
  return total;
}

/*
 * Verhoeff validation helper function
 * Called with a string of numbers
 * to validate according to the Verhoeff algorithm.
 */
function verhoeffCheck(str) {
  var d_table = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 0, 6, 7, 8, 9, 5], [2, 3, 4, 0, 1, 7, 8, 9, 5, 6], [3, 4, 0, 1, 2, 8, 9, 5, 6, 7], [4, 0, 1, 2, 3, 9, 5, 6, 7, 8], [5, 9, 8, 7, 6, 0, 4, 3, 2, 1], [6, 5, 9, 8, 7, 1, 0, 4, 3, 2], [7, 6, 5, 9, 8, 2, 1, 0, 4, 3], [8, 7, 6, 5, 9, 3, 2, 1, 0, 4], [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]];
  var p_table = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 5, 7, 6, 2, 8, 3, 0, 9, 4], [5, 8, 0, 3, 7, 9, 6, 1, 4, 2], [8, 9, 1, 6, 0, 4, 3, 5, 2, 7], [9, 4, 5, 3, 1, 2, 6, 8, 7, 0], [4, 2, 8, 6, 5, 7, 3, 9, 0, 1], [2, 7, 9, 3, 8, 0, 6, 4, 1, 5], [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]];

  // Copy (to prevent replacement) and reverse
  var str_copy = str.split('').reverse().join('');
  var checksum = 0;
  for (var i = 0; i < str_copy.length; i++) {
    checksum = d_table[checksum][p_table[i % 8][parseInt(str_copy[i], 10)]];
  }
  return checksum === 0;
}

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js ***!
  \**********************************************************************************************/
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = assertString;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function assertString(input) {
  var isString = typeof input === 'string' || input instanceof String;
  if (!isString) {
    var invalidType = _typeof(input);
    if (input === null) invalidType = 'null';else if (invalidType === 'object') invalidType = input.constructor.name;
    throw new TypeError("Expected a string but received a ".concat(invalidType));
  }
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/includes.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/includes.js ***!
  \******************************************************************************************/
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var includes = function includes(arr, val) {
  return arr.some(function (arrVal) {
    return val === arrVal;
  });
};
var _default = exports["default"] = includes;
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/merge.js ***!
  \***************************************************************************************/
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = merge;
function merge() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var defaults = arguments.length > 1 ? arguments[1] : undefined;
  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/multilineRegex.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/multilineRegex.js ***!
  \************************************************************************************************/
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = multilineRegexp;
/**
 * Build RegExp object from an array
 * of multiple/multi-line regexp parts
 *
 * @param {string[]} parts
 * @param {string} flags
 * @return {object} - RegExp object
 */
function multilineRegexp(parts, flags) {
  var regexpAsStringLiteral = parts.join('');
  return new RegExp(regexpAsStringLiteral, flags);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/toString.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/toString.js ***!
  \******************************************************************************************/
/***/ ((module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = toString;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function toString(input) {
  if (_typeof(input) === 'object' && input !== null) {
    if (typeof input.toString === 'function') {
      input = input.toString();
    } else {
      input = '[object Object]';
    }
  } else if (input === null || typeof input === 'undefined' || isNaN(input) && !input.length) {
    input = '';
  }
  return String(input);
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/whitelist.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/whitelist.js ***!
  \**************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = whitelist;
var _assertString = _interopRequireDefault(__webpack_require__(/*! ./util/assertString */ "./node_modules/.pnpm/validator@13.12.0/node_modules/validator/lib/util/assertString.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function whitelist(str, chars) {
  (0, _assertString.default)(str);
  return str.replace(new RegExp("[^".concat(chars, "]+"), 'g'), '');
}
module.exports = exports.default;
module.exports["default"] = exports.default;

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/scripts/app.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_app_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/app.scss */ "./src/scss/app.scss");
/* harmony import */ var alpinejs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! alpinejs */ "./node_modules/.pnpm/alpinejs@3.14.8/node_modules/alpinejs/dist/module.esm.js");
/* harmony import */ var _alpinejs_mask__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @alpinejs/mask */ "./node_modules/.pnpm/@alpinejs+mask@3.14.8/node_modules/@alpinejs/mask/dist/module.esm.js");
/* harmony import */ var _auth_Sign_in__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth/Sign-in */ "./src/scripts/auth/Sign-in.js");
/* harmony import */ var _auth_Sign_up__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auth/Sign-up */ "./src/scripts/auth/Sign-up.js");
/* harmony import */ var _auth_Reset_password__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./auth/Reset-password */ "./src/scripts/auth/Reset-password.js");
/* harmony import */ var _tools_Utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tools/Utils */ "./src/scripts/tools/Utils.js");
/* harmony import */ var _site_Create__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./site/Create */ "./src/scripts/site/Create.js");








window.Alpine = alpinejs__WEBPACK_IMPORTED_MODULE_1__["default"];
window.addEventListener('load', () => {
  _tools_Utils__WEBPACK_IMPORTED_MODULE_6__["default"].init();
  _auth_Sign_up__WEBPACK_IMPORTED_MODULE_4__["default"].init();
  _auth_Sign_in__WEBPACK_IMPORTED_MODULE_3__["default"].init();
  _auth_Reset_password__WEBPACK_IMPORTED_MODULE_5__["default"].init();
  _site_Create__WEBPACK_IMPORTED_MODULE_7__["default"].init();
  alpinejs__WEBPACK_IMPORTED_MODULE_1__["default"].plugin(_alpinejs_mask__WEBPACK_IMPORTED_MODULE_2__["default"]);
  alpinejs__WEBPACK_IMPORTED_MODULE_1__["default"].start();
});
document.addEventListener('DOMContentLoaded', () => {
  const userLanguage = navigator.language || navigator.userLanguage;
  document.cookie = `browser_language=${userLanguage}; path=/; max-age=${60 * 60 * 24 * 7}`;
});
})();

/******/ })()
;
//# sourceMappingURL=app.js.map