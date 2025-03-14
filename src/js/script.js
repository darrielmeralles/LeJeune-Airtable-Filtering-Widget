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
				website:"https://www.chop.edu/centers-programs/trisomy-21-program"
			},
			{
				name: "Adult Down Syndrome Center of Western Pennsylvania",
				age: "Adult",
				specializations: "Clinical Care, Holistic",
				hours: "6 - 10 days per month",
				type: "Part time",
				address:"200 Lothrop Street Pittsburg, PA 15213",
				website:"https://www.upmc.com/services/adult-down-syndrome-center"
			},
			{
				name: "Coordinated Treatment Center",
				age: "Pediatric, Adolescent",
				specializations: "O/S/P Therapy, Dietician, Social Worker",
				hours: "1 day per month",
				type: "Part time",
				address:"736 Broadway N., Fargo, ND 58122",
				website:"http://www.sanfordhealth.org/MedicalServices/DownSyndrome"
			},
			{
				name: "CDRC Down Syndrome Program",
				age: "Pediatric, Adolescent",
				specializations: "O/S/P Therapy, Audiology",
				hours: "2 - 5 days per month",
				type: "Part time",
				address:"Child Development and Rehabilitation Center 707 SW Gaines Street Portland, OR 97239OHSU,,Doernbecher Children’s Hospital 700 S.W. Campus Drive, 7th floor Portland, OR, 97239",
				website:"http://www.ohsu.edu/xd/health/services/doernbecher/programs-services/down-syndrome.cfm"
			},
			{
				name: "Division of Pediatric Genetics, Metabolism and Genomic Medicine",
				age: "Pediatric",
				specializations: "",
				hours: "",
				type: "",
				address:"Genetics at Mott Children’s Hospital: 1540 E. Hospital Drive Level 6, Reception C. Ann Arbor, MI 48109,,Pediatric Genetics in Traverse City: Munson Medical Center, Specialty Clinic Building 106 S. Madison Traverse City, MI 49684,,Pediatric Genetics in Marquette, UP Health System: 850 W Baraga Ave Marquette, MI 49855",
				website:"https://www.mottchildren.org/conditions-treatments/ped-genetics"
			}
		]
	}
};

let device = data.device;
let serviceList = data.config.serviceList;
// let layout = "grid";
let layout = "list";

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
	dmAPI.loadScript('https://irt-cdn.multiscreensite.com/fb4e9968cfa04831857624e26b678589/files/uploaded/paginates.min.js', function () {
		console.log(serviceList, "serviceList");
		paginate(serviceList);
	})
})

//CREATING DYNAMIC FILTER DROPDOWN
let age = removeDuplicate(serviceList.map(a => a.age));
let specializations = removeDuplicate(serviceList.map(a => a.specializations));
let hours = removeDuplicate(serviceList.map(a => a.hours));

createFilterDropdown(age ,'filAge', "Age");
createFilterDropdown(specializations,'filSpecialty', "Specialty");
createFilterDropdown(hours,'filHours', "Hours");

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
	paginate(filtered);
	console.log(filters, "filtered");
	console.log(filtered, "filtered");

});

// CREATE MARKUP
function markup(obj) {
    // Split the address by ',,' and create <p> elements with icons for each
    let addressArray = obj.address.split(',,')
        .map(addr => `<div class="address-item"><i class="fa-solid fa-location-dot"></i> <p class="cs-name">${addr.trim()}</p></div>`)
        .join('');

    let j = `<div class="itemBox ${layout === 'grid' ? 'itemBox-1' : 'itemBox-2'}">
                <h3 class="cs-name">${obj.name}</h3>
                <div class="contentWrapper">
                    <div class="addWrapper">
                        ${addressArray} <!-- Multiple addresses with icons -->
                    </div>
                    <a href="${obj.website}" target="_blank">
                        <button class="btnLink">
                            <span class="text">Open Clinic</span>
                        </button>
                    </a>
                </div>
              </div>`;
    return j;
}

// CREATE DROPDOWN WITH DEFAULT OPTION
function createFilterDropdown(arr, filter, filtername) {
    const dropdown = $('#' + filter);
    dropdown.empty(); // Clear existing options
    dropdown.append(`<option value="" selected disabled hidden>${filtername}</option>`);
    dropdown.append(`<option value="">Any ${filtername}</option>`);
    arr.forEach(i => {
        dropdown.append(`<option value="${i}">${i}</option>`);
    });
}

// REMOVE DUPLICATE, SORT, AND REMOVE EMPTY VALUES IN ARRAY
function removeDuplicate(arr) {
    return Array.from(new Set(
        arr.flatMap(item => 
            typeof item === 'string' 
                ? item.split(',').map(s => s.trim()).filter(s => s !== "") // Remove blanks
                : [item]
        )
    )).sort();
}

//MULTIFILTER JS
function multiFilter(arr, filters) {
    const filterKeys = Object.keys(filters);

    return arr.filter(function (eachObj) {
        return filterKeys.every(function (eachKey) {
            const filterValue = filters[eachKey]; // Selected filter value
            const objValue = eachObj[eachKey]; // Object's corresponding value

            // Ignore filter if it's empty
            if (!filterValue || filterValue.length === 0) {
                return true;
            }

            // Special handling for empty values in object
            if (objValue === "" && filterValue !== "") {
                return false; // Don't match empty values unless explicitly filtering for ""
            }

            // Handle comma-separated "specializations" and "age"
            if (eachKey === "specializations" || eachKey === "age") {
                const valueArray = objValue
                    ? objValue.split(',').map(s => s.trim()).filter(s => s !== "")
                    : [];

                return valueArray.includes(filterValue);
            }

            return filterValue.includes(objValue);
        });
    });
}

//PAGINATION 
function paginate(items){
    $('.cs-ResPage').pagination({
        dataSource: items,
        pageSize:5,
        callback: function(result, pagination) {
            console.log(result)
            let structure = '';
			structure = result.map(i=>{
				return markup(i);
			 }).join("")
             console.log(layout, "layout");
             if(layout === "grid"){
                $(".itemWrapper").html(structure);
             }else{
                $(".itemWrapper-2").html(structure);
             }
        }
    });
}