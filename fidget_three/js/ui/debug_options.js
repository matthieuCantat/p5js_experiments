
export default class Debug_options
{
    constructor( game_engine )
    {
        this.options = { 
            disable_animation:true,
            switch_selected_inter_help:false,
            inter_step_physics : false,
            mouse_selection_break_length:260,
        
            show_geos:true,
            show_effects:true,              
            show_inters:false,
            show_inters_steps:false,
            show_bones:false,
            force_visibility:false,
        
            matrix_axes:false,
            cns_axes:false,
            fidget_steps_info:false,
            mouse_info:false,
            show_warning_log:false,
        
            do_bloom_selected: false,
            do_bloom: false, 
            do_shadows: false,         
            do_flare: false,     
        }
        this.local_storage_key = "debug_options_"

        this.toggleButton = document.getElementById("debug_menu_show");
        this.menu = document.getElementById("debug_menu");
        
        

        this.toggleButton.addEventListener("click", () =>{ this.toggle_menu() } );
        this.get_from_local()
        this.fill_ui()
        game_engine.set_debug( this )
    }


    handleCheckboxChange() {
        
        const debug_elements = Array.from(document.querySelectorAll("input[name='debug']"))
        for( let elem of debug_elements)
        {
            if( elem.value == "mouse_selection_break_length")
                continue
            this.options[elem.value] = elem.checked
        }
      
        this.save_to_local()
    }
    
    fill_ui()
    {
        
        // Create checkboxes dynamically (only once)
        for (const [key, value] of Object.entries(this.options))
        {
            const checkbox_and_text = document.createElement("label");
    
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = 'debug';
            checkbox.value = key;
            checkbox.checked = value;
    
            const text = document.createTextNode(key);
    
            // Append checkbox and text to checkbox_and_text
            checkbox_and_text.appendChild(checkbox);
            checkbox_and_text.appendChild(text);
    
            // Append checkbox_and_text to the menu
            this.menu.appendChild(checkbox_and_text);
    
            // Add event listener to log selected items
            checkbox.addEventListener("change", () => { this.handleCheckboxChange() } );
        } 
    }  

    toggle_menu()
    {
    
        const debug_list_is_visible = this.menu.style.display === "block";
        if (debug_list_is_visible)
        {
            // hide it
            this.menu.style.display = "none";
            this.toggleButton.textContent = "Debug";
        } else {
            // If the list is hidden, show it
            const debug_list_is_empty = this.menu.children.length === 1;
            if (debug_list_is_empty)
                debug_choice_window_fill()
                 
            // Show it
            this.menu.style.display = "block"; // Show the list
            this.toggleButton.textContent = ""; // Update button text
        }
    } 

    save_to_local()
    {
        for( let elem in this.options )
        {
            localStorage.setItem( this.local_storage_key + elem , this.options[elem])
        }
    
    }
    
    get_from_local()
    {
        for( let elem in this.options )
        {
            if( elem == "mouse_selection_break_length")
                continue
            const checked = localStorage.getItem(this.local_storage_key + elem)
            if( checked != null )
            {
                this.options[elem] = checked == 'true'
                //console.log('local value found : ', elem , checked)
            }
                
        }
    }             
}