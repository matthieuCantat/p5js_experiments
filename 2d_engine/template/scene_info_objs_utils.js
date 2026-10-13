


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


export function draw_anim_curve( anim, body, attr, m )
{
	return {
		"m": [0, 0, 0, 1, 1],
		"shapes" : [
			{
				"m": [-200, 300, 0, 2, 1.3],
				"color": [0,0,0],
				"type": "text",
				"stroke_color":"black",
				"stroke_width":1,
				"text": "windmill_idle_root_translateY",
			},
			{
				"m": m,
				"color": [0,255,0],
				"type": "point",
				"stroke_color":"green",
				"stroke_width":5,
				points : { 'animation_keys' : [anim, body, attr] },
			},
			{
				"m": m,
				//"color": [255,0,0],
				"type": "line",
				"stroke_color":"green",
				"stroke_width":2,
				points : { 'animation_keys' : [anim, body, attr] },
			},
			{
				"m": m,
				"color": [255,0,0],
				"type": "point",
				"stroke_color":"yellow",
				"stroke_width":2,
				points : { 'baked_animation' : [anim, body, attr] },
			},				
			{
				"m": m,
				//"color": [255,0,0],
				"type": "line",
				"stroke_color":"red",
				"stroke_width":2,
				points : { 'baked_animation' : [anim, body, attr] },
			},
		],		        
	} 
}
