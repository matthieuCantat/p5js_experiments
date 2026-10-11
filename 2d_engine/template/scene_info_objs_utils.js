


function extract_objs_names(hierarchy)
{
    var objs_names = [];

    for( let obj_name in hierarchy )
    {
        if (obj_name == "m") continue;
        objs_names.push(obj_name);
        var obj_hierarchy = hierarchy[obj_name];
        var child_objs_names = extract_objs_names(obj_hierarchy);
        objs_names = objs_names.concat(child_objs_names);
    }
    
    return objs_names;
}

function extract_objs_parents(current_parent, hierarchy, obj_to_parent)
{
    

    for( let obj_name in hierarchy )
    {
        if (obj_name == "m") continue;

        obj_to_parent[obj_name] = current_parent;
        
        var obj_hierarchy = hierarchy[obj_name];
        obj_to_parent = extract_objs_parents(obj_name, obj_hierarchy, obj_to_parent);
    }

    return obj_to_parent;
}


function extract_objs_matrices(hierarchy, obj_to_matrix, level=0)
{
    level += 1
    

    for( let obj_name in hierarchy )
    {
        if( obj_name == "m" ) continue;

        
        if ( (hierarchy[obj_name] !== null )&&(hierarchy[obj_name].hasOwnProperty("m")) )
        {
            let m = hierarchy[obj_name].m;
            obj_to_matrix[obj_name] = m;
        }
            
        
        var obj_hierarchy = hierarchy[obj_name];
        let _obj_to_matrix = extract_objs_matrices( obj_hierarchy, obj_to_matrix, level);
        for( let k in _obj_to_matrix)
            obj_to_matrix[k] = _obj_to_matrix[k];
    }

    return obj_to_matrix;
}



export function get_objs(hierarchy, shapes, options)
{
    var objs = {};

    var objs_names = extract_objs_names(hierarchy);
    var objs_parents = extract_objs_parents(null, hierarchy, {} );
    var objs_matrices = extract_objs_matrices( hierarchy, {} );

    for ( let obj_name of objs_names )
    {
        
        var obj_shapes = shapes[obj_name] || {};
        var obj_options = options[obj_name] || {};

        objs[obj_name] = {
            "m": objs_matrices[obj_name] || null,
            "parent": objs_parents[obj_name],
            "shapes": obj_shapes["shapes"] || [],
            "interaction_shapes": obj_shapes["interaction_shapes"] || [],
            "transform_settings": obj_options["transform_settings"] || {},
            "interaction_settings": obj_options["interaction_settings"] || {},
        }
    }
    
    return objs
}

