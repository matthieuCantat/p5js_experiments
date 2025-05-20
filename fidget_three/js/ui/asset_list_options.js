
export default class Asset_list_options
{
    constructor(game_engine)
    {

        this.assets_name = [
            'fidgets_sequence',
            'fidget_daft_i',
            'fidget_simple_slide',
            'fidget_windmill',
            'fidgets_grid',
        ]
        this.current_asset = ''
        this.local_storage_key = "Asset_list_options_choice"

        this.menu = document.getElementById("menu-select");
        
        this.get_from_local()
        this.fill_ui()
        let asset = game_engine.get_asset( this.current_asset)
        game_engine.load_asset(asset)

        // callbacks 
        this.menu.addEventListener('change', (event) =>{
            this.current_asset = event.target.value;
            asset = game_engine.get_asset( this.current_asset)
            game_engine.load_asset(asset)
            this.save_to_local()
        })
  
    }


    fill_ui()
    {
        //console.log(categories_sorted, fileLinks);
        const newCategoryElement = this.menu
        this.assets_name.forEach(option => {
            const newOption = document.createElement("option");
            newOption.value = option; // Set the value attribute
            newOption.textContent = option; // Set the text inside the option
            if( option == this.current_asset )
                newOption.selected = true
            newCategoryElement.appendChild(newOption); // Add to the <select> element
        }); 
    }


    save_to_local()
    {
        console.log("save_to_local", this.current_asset)
        localStorage.setItem( this.local_storage_key, this.current_asset)
    
    }
    
    get_from_local()
    {
        this.current_asset = localStorage.getItem(this.local_storage_key)
        console.log("get_from_local",this.current_asset)
    }          
    
}
