let element = $('.widget-abc123');
let data = {
	device: 'desktop', //desktop, tablet, mobile
	inEditor: true,
	siteId: '',
	elementId: '',
	config: {
		serviceList: [
			{
				name: "Trisomy 21 Program",
				age: "All",
				specializations: "Occupational Therapy, Education/Inclusion Specialist, Behavioral MD, Nutrition/Feeding",
				hours: "2 - 5 days per month",
				type: "Part time",
				address:"34th Street & Civic Center Blvd. Philadelphia, PA 19104",
				website:"www.chop.edu/centers-programs/trisomy-21-program"
			},
			{
				name: "Adult Down Syndrome Center of Western Pennsylvania",
				age: "Adult",
				specializations: "Clinical Care, Holistic",
				hours: "6 - 10 days per month",
				type: "Part time",
				address:"200 Lothrop Street Pittsburg, PA 15213",
				website:"https://www.upmc.com/services/adult-down-syndrome-center"
			}
		]
	}
};

let device = data.device;
let serviceList = data.config.serviceList;

let noCollectMessage = 'No data was found.' ///data.config.noCollectMessage
let noCollectSubMessage = 'This will be hidden on preview and live site.' ///data.config.noCollectSubMessage

switch (device) {
	case 'desktop':
		$(element).width("960px");
		break;
	case 'tablet':
		$(element).width("875px");
		break;
	default:
		$(element).width("326px");
}


//ADD MULTIPLE LINK SOURCE HERE
dmAPI.runOnReady('init', function () {
	dmAPI.loadScript('https://irt-cdn.multiscreensite.com/8914113fe39e47bcb3040f2b64f71b02/files/uploaded/paginates.min.js', function () {


	})

	console.log(serviceList, "serviceList")
})

//CREATING DYNAMIC FILTER DROPDOWN
let age = removeDuplicate(serviceList.map(a => a.age));
let specializations = removeDuplicate(serviceList.map(a => a.specializations));
let hours = removeDuplicate(serviceList.map(a => a.hours));

createFilterDropdown(age ,'filAge');
createFilterDropdown(specializations,'filSpecialty');
createFilterDropdown(hours,'filHours');


//FILTER ONCHANGE
$('.filWrap select').change(function(){
    let selectedAge = $('#filAge').val();
    let selectedSpecialty = $('#filSpecialty').val();
    let selectedHours = $('#filHours').val();
    let selectedType = $('#filEmployType').val();
    let filters = {};

    if(selectedAge !== null){
        filters.age = selectedAge;
    }
    if(selectedSpecialty !== null){
        filters.specializations= selectedSpecialty;
    }
    if(selectedHours !== null){
        filters.hours = selectedHours;
    }
    if(selectedType !== null){
        filters.type = selectedType;
    }

	let filtered = multiFilter(serviceList, filters);

	console.log(filters, "filtered");
	console.log(filtered, "filtered");

});


//FUNCTIONS

// CREATE DROPDOWN WITH DEFAULT OPTION
function createFilterDropdown(arr, filter) {
    const dropdown = $('#' + filter);
    dropdown.empty(); // Clear existing options
    dropdown.append('<option value="" selected disabled hidden>Select an Option</option>');
    dropdown.append('<option value="">Any</option>');
    arr.forEach(i => {
        dropdown.append(`<option value="${i}">${i}</option>`);
    });
}

// REMOVE DUPLICATE AND SORT IN ARRAY
function removeDuplicate(arr) {
    return Array.from(new Set(arr.flatMap(item => 
        typeof item === 'string' ? item.split(',').map(s => s.trim()) : [item]
    ))).sort();
}

//MULTIFILTER JS
function multiFilter(arr,filters){
    const filterKeys = Object.keys(filters);
    return arr.filter(function(eachObj){
        return filterKeys.every(function(eachKey){
        if (!filters[eachKey].length) {
            return true; // passing an empty filter means that filter is ignored.
        }
        return filters[eachKey].includes(eachObj[eachKey]);
        });
    });
}
