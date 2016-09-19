# Fabler Storytelling Engine

_Fabler_ is a new game engine for text adventures - also called interactive fiction - and is a complete clean room implementation.

## Licensing

_Fabler_ is distributed under the terms of the GPL version 3.0 or newer, and is freely available to anyone who wishes to write new games with it.

## Building

Building _Fabler_ requires that `nodejs`, `npm`, and `grunt-cli` are installed. 

Once installed, you can build a distribution with `grunt dist`.

## Architecture

_Fabler_ uses a *component-based architecture* for its basic design. There's a _core engine_, and functionality is implemented as _modules_. The engine is designed around encapsulation through implementation hiding, closures, and direct access to dependencies. JavaScript objects are based on _prototypal inheritance_, and the engine's design *rejects the classical inheritance available in ECMAScript 6*.

### Layers

The engine is comprised of three major layers:
* Engine core (kernel)
* Core modules
* Modules

The intent of this design is that the _engine core_ provides basic functionality, including the component system. The _core modules_ provide all the basic functionality needed for the game engine, and are bootstrapped by the _engine core_. Additional _modules_ can be loaded at any time. The difference between a _core module_ and a plain _module_ is the API access level: _core modules_ have direct access to publish to the public API, and have privileged access to some objects/methods.

### Engine core

The core is implemented in a JavaScript object that publishes a public API as the `FABLER` global object.

### Modules

Modules, if accessible, are reachable through the `modules` property. Each _module_ is a JavaScript object published to the engine by calling `FABLER.add()`. Third-party modules have no access to other modules directly, are self-contained, and can only be invoked from the engine itself.