# Dynamic Proto JavaScript

Generates dynamic prototype methods for JavaScript objects (classes) by supporting method definition within their "class" constructor (like an instance version), this removes the need to expose internal properties on the instance (this) and the usage of ```ClassName.prototype.funcName()``` both of which result in better code minfication (smaller output) and therefore improved load times for your users.

The dynamically generated prototype methods support class inheritance of any type, which means you can extend from base classes that use instance or prototype defined methods, you also don't need to add the normal boiler plate code to handle detecting, saving and calling any previous instance methods that you are overriding as support for this is provided automatically. 

So whether creating a new class or extending some other class/code, your resulting code, can be successfully extended via TypeScript or JavaScript.

## Removing / Hiding internal properties from instance
By defining the properties / methods within the constructors closure, each instance can contain or define internal state in the form of properties which it does not have to expose publically as each defined "public" instance method has direct access to this define state within the context/scope of the closure method. 

While this does require some additional CPU and memory at the point of creating each instance object this is designed to be as minimal as possible and should be outwayed by the following advantages :-

* Avoids polluting the instance (this) namespace with internal values that can cause issues with inheritence for base/super classes or even derived classes that extend your class.
* Smaller code as the internal properties and methods when defined within the instance can be minified.
* As the resulting generated code can be better minified this *should* result in a smaller minified result and therefore better load times for your users. 

## Basic Usage
```typescript
import dynamicProto from "@microsoft/dynamicproto-js";
class ExampleClass extends BaseClass {
    constructor() {
        dynamicProto(ExampleClass, this, (_self, base) => {
            // This will define a function that will be converted to a prototype function
            _self.newFunc = () => {
                // Access any "this" instance property  
                if (_self.someProperty) {
                    ...
                }
            }
            // This will define a function that will be converted to a prototype function
            _self.myFunction = () => {
                // Access any "this" instance property
                if (_self.someProperty) {
                    // Call the base version of the function that we are overriding
                    base.myFunction();
                }
                ...
            }
            _self.initialize = () => {
                ...
            }
            // Warnings: While the following will work as _self is simply a reference to
            // this, if anyone overrides myFunction() the overridden will be called first
            // as the normal JavaScript method resolution will occur and the defined
            // _self.initialize() function is actually gets removed from the instance and
            // a proxy prototype version is created to reference the created method.
            _self.initialize();
        });
    }
}
```

## Build & Test this repo

1. Install all dependencies

    ```sh
    npm install
    npm install -g @microsoft/rush
    ```

2. Navigate to the root folder and update rush dependencies

    ```sh
    rush update
    ```

3. Build, lint, create docs and run tests

    ```sh
    rush build
    npm run test
    ```

If you are changing package versions or adding/removing any package dependencies, run<br>**```rush update --purge --recheck --full```**<br>before building. Please check-in any files that change under common\ folder.

## Performance

The minified version of this adds a negligible amount of code and loadtime to your source code and by using this library, your generated code can be better minified as it removes most references of Classname.prototype.XXX methods from the generated code.

> Summary:
>
> - **~2 KB** minified (uncompressed)

## Example usage and resulting minified code

In this first example of code that is typically emitted by TypeScript it contains several references to the Classname.prototype and "this" references, both of which cannot be minfied.

```Javascript
var NormalClass = /** @class */ (function () {
    function NormalClass() {
        this.property1 = [];
        this.property1.push("Hello");
    }
    NormalClass.prototype.function1 = function () {
        //...
        doSomething();
    };
    NormalClass.prototype.function2 = function () {
        //...
        doSomething();
    };
    NormalClass.prototype.function3 = function () {
        //...
        doSomething();
    };
    return NormalClass;
}());
```

So the result would look something like this which represents a ~45% compression, note that the Classname.prototype appears several times.

```JavaScript
var NormalClass=(NormalClass.prototype.function1=function(){doSomething()},NormalClass.prototype.function2=function(){doSomething()},NormalClass.prototype.function3=function(){doSomething()},function(){this.property1=[],this.property1.push("Hello")});
```

While in this example when using the dynamicProto helper to create the same resulting class and objects there are no references to Classname.prototype and only 1 reference to this.

```JavaScript
var DynamicClass = /** @class */ (function () {
    function DynamicClass() {
        dynamicProto(DynamicClass, this, function (_self, base) {
            _self.property1 = [];
            _self.property1.push("Hello()");
            _self.function1 = function () {
                //...
                doSomething();
            };
            _self.function2 = function () {
                //...
                doSomething();
            };
            _self.function3 = function () {
                //...
                doSomething();
            };
        });
    }
    return DynamicClass;
}());
```

Which results in the following minified code which is much smaller and represents ~63% compression.

```Javascript
var DynamicClass=function n(){dynamicProto(n,this,function(n,o){n.property1=[],n.property1.push("Hello()"),n.function1=function(){doSomething()},n.function2=function(){doSomething()},n.function3=function(){doSomething()}})};
```

 So when looking at the code for NormalClass and DynamicClass, both end up with 1 instance property called ```property1``` and the 3 functions ```function1```, ```function2``` and ```function3```, in both cases the functions are defined ONLY on the "class" prototype and ```property1``` is defined on the instance. So anyone, whether using JavaScript or TypeScript will be able to "extend" either of class without any concerns about overloading instance functions and needing to save any previous method. And you are extending a 3rd party library you no longer have to worry about them changing the implementation as ```dynamicProto()``` handles converting overriden instance functions into prototype level ones. Yes, this means that if you don't override instance function it will continue to be an instance function.

## When to use

While this helper was created to support better minification for generated code via TypeScript code, it is not limited to only being used from within TypeScript, you can use the helper function directly in the same way as the examples above.

As with including any additional code into your project there are trade offs that you need to make, including if you are looking at this helper, one of the primary items is the overall size of the additional code that you will be including vs the minification gains that you *may* obtained. This project endeavours to keep it's impact (bytes) as small as possible while supporting you to create readable and maintainable code that will create a smaller minified output.

In most cases when creating JavaScript to support better minfication, when your code doesn't expose or provide a lot of public methods or only uses un-minifiable "names" less than 2 times, then you may not see enough potential gains to counteract the additional bytes required from the helper code. However, for any significant project you should.

So at the end of the day, if you are creating JS classes directly you *should* be able to create a simplier one-off solution that would result in smaller output (total bytes). This is how this project started, but, once we had several of these one-off solutions it made more sense to build it once.

## Performance optimizations (from v1.1)

To aid with execution performance from v1.1.0 (by default) the dynamically generated prototype functions will attempt to directly assign a top-level instance function (on first execution) of each function. This means that subsequent calls to that function will directly call the target instance function and avoid the dynamic function lookup process, this provides a minor performance improvement assists with identifying the called functions during profiling.

To ensure that this does not break inheritance there are 3 prerequisites that must be true before this happens
- This check is only performed once per instance, per dynamic function
- The instance cannot already have an existing instance level function (duh!)
- The dynamic proto function MUST be the FIRST prototype level function in the inherited class hierarchy.
  - This simply means if a new class extends a class which is using dynamicProto() and it provides it's own prototype (class level in TypeScript terms) function, then we can't set an instance level as this would cause the class level function to never get called.

You can disable this default behavior by passing a new (optional) 4th argument to the dynamicProto(), the new 'options' argument is defined as an interface IDynamicProtoOpts to aid with any future options that may get exposed and has the following values
| Name | Type | Description
|------|------|-------------
| setInstFuncs | Boolean | Should the dynamic prototype attempt to set an instance function for instances that do not already have an function of the same name or have been extended by a class with a (non-dynamic proto) prototype function.

> Note:
>
> If ANY class in the hierarchy explicitly disables this behavior (passes options object with a value of ```setInstFuncs: false```) to it's dynamicProto() calls, then that will block ALL functions for all classes, even if a base class explicitly passes an options with it set to true. This enables any class to explicitly disable this behavior should some unknown and unexpected issue occur, if you encounter something that requires this usage then please raised an issue (or provide a PR) so we can resolve for everyone.

## Included NPM distribution formats

As part of the build / publish formats via NPM we include the following module formats:

* dist/esm – Used as the "module" definition for npm, which keeps the bundle as an ES module file, suitable for other bundlers and inclusion as a &lt; amd – Asynchronous Module Definition, used with module loaders like RequireJS
* dist/node - Used as the "main" npm entry point for the utility, using the umd format with any third party modules located and included using the [Node resolution algorithm](https://nodejs.org/api/modules.html#modules_all_together)

### Other included formats

* dist/cjs – CommonJS, suitable for Node and other bundlers
script type=module&gt; tag in modern browsers
* dist/iife – A self-executing function, suitable for inclusion as a &lt;script&gt; tag. (If you want to create a bundle for your application, you probably want to use this.)
* dist/umd – Universal Module Definition, works as amd, cjs and iife all in one
* dist/system – Native format of the SystemJS loader

## TypeScript Declaration Helper

When using TypeScript to create classes and automatically generate the declaration (*.d.ts) files for your classes you will run into one or more of the following issues :-

1) When you attempt to extend a base class which defines an abstract member (class) function you will get 
```error TS2424: Class 'ABC' defines instance member function 'myFunction', but extended class 'XYZ' defines it as instance member property.``` 
    * The only solution for this is to define an empty 'Stub' method which stops the error, but also generates an unused prototype method in your final code that just takes up space.

```typescript
export abstract class ABC {
    public myFunction(someArg:string): void {
    }

    public abstract myFunction2(theArg:string, ...): void;
}

export class XYZ extends ABC {
    public myFunction2(theArg:string, ...): void {
        // This stub is required otherwise it won't compile
        // It's also extra unnecessary code in the final code
    }

    constructor() {
        dynamicProto(XYZ, this, (self, base) => {
            self.myFunction = (someArg) => {
                // This implements a member function (on the prototype)
            };

            self.myFunction2 = (theArg:string, ...) => {
            };
        });
    }
}
```

The above results in the following javascript output for XYZ class where the XYZ.prototype.myFunction2 is obsolete (as it gets replace), unnecessary (for the class to function) and uncompressable bloat for the code

```javascript
var XYZ = /** @class */ (function () {
    function XYZ() {
        dynamicProto(XYZ, this, (self, base) => {
            // ... Removed for brevity ...
            self.myFunction2 = (theArg:string, ...) => {
            };
        });
    }
    XYZ.prototype.myFunction2 = function () {
        // This stub is required otherwise it won't compile
        // It's also extra unnecessary code in the final code
    };
    return XYZ;
}());
```

2) When you are creating a class that you want users to be able to extend (using TypeScript), and you want all of the functions to be declared (in the *.d.ts) as member functions (not properties), so that the extendsion classes (using typescript) can just use the normal ```super``` keyword without forcing them to either use dynamicProto() or save / call the instance properties.
    * As with above the only solution (for dynamically generated declaration files) would be to defined Stub methods as above.

```typescript
export class BaseClass {
    // A Member function
    public myFunction(someArg:string):void { 
        // Stub function
    }

    // A instance member property (which happens to be a function)
    public propFunction: (theArgs:string) => void;

    constructor() {
        dynamicProto(BaseClass, this) (self) => {
            // This will create (at runtime) a member functions
            self.myFunction = (someArg:string) => {
            };
            self.propFunction = (theArgs:string) => {
            };
        });
    }
}

export class NewClass extends BaseClass {
    // This works as TS see's that the base class has a prototype
    // function (not a property one)
    public myFunction(someArg:string:void) {
        super.myFunction(someArg);
    }

    public propFunction(theArgs:string): void {
        // This doesn't work as you can't call super on properties
        // Even though, when the base class is using dynamicProto()
        // this WILL work!
        super.propFunction(theArgs);
    }
}
```

So in both of these cases the only workable solutions are either :- 

* Define Stub member functions and live with the code bloat
* Just don't use dynamicProto() and again live with the larger file size.

So assuming that you do want to continue using dynamicProto() and don't want to deal with the additional code bloat, this project includes a simple rollup plugin included in the ```tools/rollup``` folder that can be used to remove "tagged" stub code from the resulting output during packaging. 

This is a Post processor that removes any code/comments (not just function) that are "tagged" from the resulting output, thus removing the Stub methods and the resulting code bloat from your final packaged code, but still leaving typescript declaration with the final (runtime) member function definition.

The plugin uses the following rules to identify and remove tagged code :-

* The function must be a instance member function (a prototype level function) where the generated JS looks like "```MyClass.prototype.methodName = function () { };```"
* The ```tagname``` must appear either on the line before the function name (pre); on the closing line of the function (post) (NOTE: Not after as TypeScript can drop this from the final output) or within the stub function (enclosed).
    ```
    // @DynamicProtoStub
    MyClass.prototype.methodName = function () {
    };

    MyClass.prototype.methodName = function () {
    }; // @DymanicProtoStub

    MyClass.prototype.methodName = function () {
        // @DynamicProtoStub
    };

    MyClass.prototype.methodName = function () {
        /* @DynamicProtoStub 
        * Some other comments
        */
    };
    ```
* The pre and post tagging comments must be defined using a single line comment "```// @DynamicProtoStub```" only.
* Enclosed tagging comments (within the function definition) may be defined using either single or multi-line comments. But the tagging comment MUST be the first comment within the function.
* The function *may* be prefixed by a typedoc comment of "```/** Description @param arg - arg details */```" etc, which will be removed if the function is removed. However, it will not remove other prefixed single or multi-line comments.
* The ```tagname``` must be the first "element"/"word" of any comment with optional leading spaces or tabs only. 
    * e.g. These would not match "```// - @DynamicProtoStub```", "```// This is the @DynamicProtoStub```"
* Tagging comments may contains additional trailing content (after the tagName) and will also be removed
    * "```// @DynamicProtoStub - Will be removed!```"
* If the stub function appears to contain any logic, specifically a closing bracket ```}``` (including with a comment) will cause the function to not be matched and removed.
* A final check is performed after removing all tagged functions for any remaining tags within the result and if any tags are detected it will cause the removal process to throw and fail the conversion. This ensures that if you expected a function to be removed that it has been removed.
    * If your build is failing please check that the tagging comments conform to the above rules, failures normally occur because of unexpected formatting changes.

Some possible examples
```typescript
/**
 * The typedoc comments
 */
// @DynamicProtoStub
public toBeRemoved():void {
}
 
// @DynamicProtoStub
public toBeRemoved():void {
}

/**
 * This function does stuff
 * @param args - used in the function
 */
public myFunction(args:string): void {
    ...
} // @DynamicProtoStub - Function will be removed

public myFunction2(): void {
...
}  // @DynamicProtoStub - Function will be removed

/**
 * This function does stuff
 * @param args - used in the function
 */
public myFunction(args:string): void {
    // @DynamicProtoStub - Function will be removed
}

public myFunction2(): void {
    /* @DynamicProtoStub 
     * Function will be removed
     */
}  

```

For clarification the following will NOT match or get removed
```typescript

public myFunction3(): void {
}
// @DynamicProtoStub - This method will not be removed


// @DynamicProtoStub - This method will not be removed

public myFunction4(): void {
}

public myFunction4(): void {
    /* 
     * @DynamicProtoStub 
     * This will fail because the tag is not the first 
     * "element"/"word" of any comment with optional 
     * leading spaces or tabs only. 
     */
}

public myFunction4(): void {
    // This is a stub
    /* @DynamicProtoStub 
     * This will fail because the tagging comment is not
     * the first comment within the function. 
     */
}

```

### Adding to you own rollup.config.js

```javascript
import dynamicRemove from "@microsoft/dynamicproto-js/tools/rollup/node/removedynamic";

  const moduleRollupConfig = {
    input: `${inputName}.js`,
    output: {
      file: `./dist/${format}/${outputName}.js`,
      banner: banner,
      format: format,
        name: "OutputName-JS",
      extend: true,
      sourcemap: true
    },
    plugins: [
      dynamicRemove(),
      dynamicRemove({ tagname: "@MyTagName" }),
      nodeResolve(),
      uglify({
        ie8: true,
        toplevel: true,
        compress: {
          passes:3,
          unsafe: true
        },
        output: {
          preamble: banner,
          webkit:true
        }
      })
    ]
  };

```

### Not using Rollup? ###

Then let us know or simply take the embedded RegEx, and wrap it into your favorite tool and submit a PR. 

It should be as simple as :-

* Load the TypeScript generated JS output source file
* Apply the regex using replace to "remove" the tagged code, if the named group tags where detected.
* Write the new resulting file to the output path (or stream)
* Do the final check for any "remaining" tags, which represents a failed matching

## Browser Support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE8](https://raw.githubusercontent.com/hotoo/browser-logos/master/ie9-10/ie9-10_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 8+ Full ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

## ES3/IE8 Compatibility

As a library there are numerous users which cannot control the browsers that their customers use. As such we need to ensure that this library continues to "work" and does not break the JS execution when loaded by an older browser. While it would be ideal to just not support IE8 and older generation (ES3) browsers there are numerous large customers/users that continue to require pages to "work" and as noted they may or cannot control which browser that their end users choose to use.

As part of enabling ES3/IE8 support we have set the ```tsconfig.json``` to ES3 and ```uglify``` settings in ```rollup.config.js``` transformations to support ie8. This provides a first level of support which blocks anyone from adding unsupported ES3 features to the code and enables the generated javascript to be validily parsed in an ES3+ environment.

Ensuring that the generated code is compatible with ES3 is only the first step, JS parsers will still parse the code when an unsupport core function is used, it will just fail or throw an exception at runtime. Therefore, we also need to require/use polyfil implementations or helper functions to handle those scenarios.

### ES3/IE8 Features, Solutions, Workarounds and Polyfill style helper functions

This table does not attempt to include ALL of the ES3 unsupported features, just the currently known functions that where being used at the time or writing. You are welcome to contribute to provide additional helpers, workarounds or documentation of values that should not be used.

|  Feature  |  Description  |  Usage |
|-----------|-----------------|------|
| ```Object.keys()``` | Not provided by ES3 and not used | N/A |
| ES5+ getters/setters<br>```Object.defineProperty(...)``` | Not provided by ES3 and not used | N/A |
| ```Object.create(protoObj, [descriptorSet]?)``` | Not provided by ES3 and not used | N/A |
| ```Object.defineProperties()``` | Not provided by ES3 and not used | N/A |
| ```Object.getOwnPropertyNames(obj)``` | Not provided by ES3 and not used | ```_forEachProp(target:any, callback: (name: string) => void)``` |
| ```Object.getPrototypeOf(obj)``` | Not provided by ES3 and not used | ```_getObjProto(target:any)``` |
| ```Object.getOwnPropertyDescriptor(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.preventExtensions(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.isExtensible(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.seal(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.isSealed(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.freeze(obj)``` | Not provided by ES3 and not used | N/A |
| ```Object.isFrozen(obj)``` | Not provided by ES3 and not used | N/A |

## Contributing

Read our [contributing guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Application Insights.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft’s Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party’s policies.

## License

[MIT](LICENSE)
