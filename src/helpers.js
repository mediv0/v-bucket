import {
    parsePath,
    isStringNotEmpty,
    isPathAlreadyCalculated,
    arrayToPath
} from "./utils";
import { ModuleNotFound } from "./Errors";

export function searchNestedModules(path, bucket) {
    // if the path already calculated. there is no need to do it again
    const _nodes = (isPathAlreadyCalculated(path) && path) || parsePath(path);

    let _lastModuleName = "root";
    // if the user just provide a name but not a valid path, we return the root instance
    if (_nodes.length === 1 && isStringNotEmpty(_nodes)) {
        return {
            module: bucket,
            actionName: path
        };
    }
    // set root module
    let _currentModule = bucket;
    // iterate over the modules tree to find the current module
    for (let i = 0; _nodes.length > 1; i++) {
        // remove visited module
        const _nextPath = _nodes.shift();
        _lastModuleName = _nextPath;
        // get nested module if there is any
        _currentModule = _currentModule._modulesDictionary.get(_nextPath);
        if (!_currentModule) {
            throw new ModuleNotFound(
                `We couldn't find your requested module. path: ${path} # module: ${_nextPath}`
            );
        }
    }

    /*
            we use slice to prevent mutation
    */
    const actionName = _nodes.slice(-1).toString();
    const nextModuleName = _lastModuleName;
    const nextPath = arrayToPath(..._nodes);
    return {
        module: _currentModule,
        actionName,
        nextModuleName,
        nextPath
    };
}

export function createStateTree(_root) {
    if (_root._data) {
        /*
            saving _data reference in _states, 
            will let us take advantage of Vue reactive system to update our states object dynamically
        */
        _root._states = _root._data;
        if (_root._modulesDictionary.size) {
            _root._modulesDictionary.forEach((val, key) => {
                _root._states[key] = val._states;
            });
        }
    } else {
        return;
    }
}
