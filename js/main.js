import $ from 'jquery';
import json from '../data/data.json'

$(function () {
    let chosenFilters = [];

    const listingData = json;
    const jobsContainer = $('.listingCards');
    const filtersContainer = $('.filtersContainer');
    const companiesDropdown = $('.companiesDropdown');
    $('.filtersContainer').hide();


    function createJob(data) {
        const languagesFilters = data.languages.map(language => `<div class="filter" data-filter="${language}">${language}</div>`).join('');
        const toolsFilters = data.tools.map(tool => `<div class="filter" data-filter="${tool}">${tool}</div>`).join('');
        return `
            <div data-id="${data.id}" class="job">
                <div class="job__delete">x</div>
                <img src="./images/${data.logo}" alt="Company Logo" class="job__image">
                <div class="job__information ml-10">
                <p class="job__information__company inline-block mb-10">${data.company}</p>
                ${data.new ? '<span class="job__information__new">New!</span>' : ''}
                ${data.featured ? '<span class="job__information__featured">Featured</span>' : ''}
                <h3 class="job__information__position mb-10">${data.position}</h3>
                <div class="job__information__details">
                    <p class="job__information__details__postedAt">${data.postedAt}</p>
                    <span class="job__information__details__separator"></span>
                    <p class="job__information__details__contract">${data.contract}</p>
                    <span class="job__information__details__separator"></span>
                    <p class="job__information__details__location">${data.location}</p>
                </div>
                </div>
                <div class="job__filters">
                ${languagesFilters}
                ${toolsFilters}
                </div>
            </div>
        `
    }

    $(document).on('click', '.job__delete', function (e) {
        const jobId = $(this).closest('.job').data('id');
        $(`.job[data-id="${jobId}"]`).hide();
        e.stopPropagation();
    });

    function createFilterElement(filter) {
        return `
        <div data-filter="${filter}" class="jobFilter">
            <p class="jobFilter__text">${filter}</p>
            <div class="jobFilter__delete">x</div>
        </div>
        `
    }

    function filterJobs() {
        const filteredJobs = listingData.filter(job => {
            const tags = [...job.languages, ...job.tools];
            return chosenFilters.every(filter => tags.includes(filter));
        });

        jobsContainer.empty();

        loadJobs(filteredJobs);
    }

    function loadJobs(data) {
        data.forEach(job => {
            jobsContainer.append(createJob(job));
        });
    }

    $(document).on('click', '.filter', function (e) {
        const filter = $(this).data('filter');
        const filterIndex = chosenFilters.indexOf(filter);

        if (filterIndex === -1) {
            chosenFilters.push(filter);
            filtersContainer.prepend(createFilterElement(filter));
            $('.filtersContainer').show();
        } else {
            chosenFilters.splice(filterIndex, 1);
            $(`.jobFilter[data-filter="${filter}"]`).remove();
            if (chosenFilters.length === 0) {
                $('.filtersContainer').hide();
            }
        }
        filterJobs();
        e.stopPropagation();
    });

    $(document).on('click', '.jobFilter__delete', function () {
        const filter = $(this).parent().data('filter');
        const filterIndex = chosenFilters.indexOf(filter);

        chosenFilters.splice(filterIndex, 1);
        if (chosenFilters.length === 0) {
            $('.filtersContainer').hide();
        }
        $(`.jobFilter[data-filter="${filter}"]`).remove();

        filterJobs();
    });

    $(document).on('click', '.clearFilters', function () {
        chosenFilters = [];
        $('.filtersContainer').hide();
        filterJobs();
    });

    $(document).on('click', '.job', function () {
        const jobId = $(this).data('id'); 
        const job = findJobById(jobId); 
        if (job) {
            openJobDetailsPopup(job); 
        }
    });


    $(document).on('click', '.close-popup', function () {
        closeJobDetailsPopup();
    });

    function openJobDetailsPopup(job) {
        const popupContent = $('.popup-content');
        const languagesFilters = job.languages.map(language => `<div class="filter" data-filter="${language}">${language}</div>`).join('');
        const toolsFilters = job.tools.map(tool => `<div class="filter" data-filter="${tool}">${tool}</div>`).join('');
        popupContent.html(`
        <img src="./images/${job.logo}" alt="Company Logo" class="job__image">
        <div class="job__information ml-10">
          <p class="job__information__company inline-block mb-10">${job.company}</p>
          ${job.new ? '<span class="job__information__new">New!</span>' : ''}
                ${job.featured ? '<span class="job__information__featured">Featured</span>' : ''}
                <h3 class="job__information__position mb-10">${job.position}</h3>
                <div class="job__information__details">
                    <p class="job__information__details__postedAt">${job.postedAt}</p>
                    <span class="job__information__details__separator"></span>
                    <p class="job__information__details__contract">${job.contract}</p>
                    <span class="job__information__details__separator"></span>
                    <p class="job__information__details__location">${job.location}</p>
                </div>
                </div>
                <div class="job__filters">
                ${languagesFilters}
                ${toolsFilters}
                </div>
        <p class="job__description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Vero velit doloremque dolores ex dolorem ipsum, deleniti 
          non ea maiores quisquam illum omnis sint animi voluptatum 
          iure ipsa repudiandae fugiat veniam. Debitis quisquam doloremque, 
          labore earum vel nostrum temporibus cupiditate error ipsum natus explicabo. 
         </p>
        <a class="job__callToAction btn">Apply Now!</a>
      <span class="close-popup">Close</span>
        </div>
        `);
        $('.job-details-popup').show(); 
        $('.overlay').show(); 
    }



    function closeJobDetailsPopup() {
        $('.job-details-popup').hide();
        $('.overlay').hide(); 
    }

    function findJobById(jobId) {
        return listingData.find(job => job.id === jobId);
    }

    $(document).on('click', '.addJob', function () {
        $('.job-create-popup').show();
        $('.overlay').show();
        listingData.forEach(job => {
            companiesDropdown.append(`<option value="${job.id}">${job.company}</option>`);
        });

    });

    function createNewJob() {
        const company = $('#company').val();
        const role = $('input[name="role"]:checked').val();
        const level = $('input[name="level"]:checked').val();
        const languages = $('input[name="languages"]:checked').map(function () {
          return $(this).val();
        }).get();
        const tools = $('input[name="tools"]:checked').map(function () {
          return $(this).val();
        }).get();
        const contract = $('input[name="contract"]:checked').val();
        const location = $('.locationDropdown').val(); 


        const companyName = listingData[company - 1].company;
        const companyImage = listingData[company - 1].logo;
      
        const maxId = Math.max(...listingData.map(job => job.id));
        const newJobId = maxId + 1;
      
        const newJob = {
          id: newJobId,
          company: companyName,
          logo: companyImage,  
          new: true, 
          featured: false, 
          position: level + ' ' + role + ' Developer', 
          role: role,
          level: level,
          postedAt: 'Just now', 
          contract: contract, 
          location: location, 
          languages: languages,
          tools: tools,
        };

        jobsContainer.append(createJob(newJob));
    }

    function closeJobCreatePopup() {
        $('#company').val('');
        $('input[name="role"]').prop('checked', false);
        $('input[name="contract"]').prop('checked', false);
        $('input[name="level"]').prop('checked', false);
        $('input[name="languages"]').prop('checked', false);
        $('input[name="tools"]').prop('checked', false);
        $('.job-create-popup').hide();
        $('.overlay').hide();
    }

    $(document).on('click', '.createJob__close-popup', function () {
        closeJobCreatePopup();
    });

    $(document).on('click', '.create-job__button', function () {
        const company = $('#company').val();
        const role = $('input[name="role"]:checked').val();
        const level = $('input[name="level"]:checked').val();
        const languages = $('input[name="languages"]:checked').map(function () {
          return $(this).val();
        }).get();
        const tools = $('input[name="tools"]:checked').map(function () {
          return $(this).val();
        }).get();
        const contract = $('input[name="contract"]:checked').val(); 
        const location = $('.locationDropdown').val(); 
      
        if (!company || !role || !level || !contract || !location || languages.length === 0 || tools.length === 0) {
          $('.create-job__error').show();
          return;
        }
      
        $('.create-job__error').hide();

        createNewJob();
        closeJobCreatePopup();
    });


    loadJobs(listingData);


});