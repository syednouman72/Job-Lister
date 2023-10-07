import $ from 'jquery';
import json from '../data/data.json'

$(function() {
    let chosenFilters = [];

    const listingData = json;
    const jobsContainer = $('.listingCards');
    const filtersContainer = $('.filtersContainer');
    $('.filtersContainer').hide();


    function createJob(data) {
        const languagesFilters = data.languages.map(language => `<div class="filter" data-filter="${language}">${language}</div>`).join('');
        const toolsFilters = data.tools.map(tool => `<div class="filter" data-filter="${tool}">${tool}</div>`).join('');
        return `
            <div data-id="${data.id}" class="job">
                <div class="job__delete">x</div>
                <img src="${data.logo}" alt="Company Logo" class="job__image">
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

    $(document).on('click', '.job__delete', function() {
        const jobId = $(this).closest('.job').data('id'); 
        $(`.job[data-id="${jobId}"]`).hide();
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

    $(document).on('click', '.filter', function() {
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
    });

    $(document).on('click', '.jobFilter__delete', function() {
        const filter = $(this).parent().data('filter');
        const filterIndex = chosenFilters.indexOf(filter);

        chosenFilters.splice(filterIndex, 1);
        if (chosenFilters.length === 0) {
            $('.filtersContainer').hide();
        }
        $(`.jobFilter[data-filter="${filter}"]`).remove();

        filterJobs();
    }); 

    $(document).on('click', '.clearFilters', function() {
        chosenFilters = [];
        $('.filtersContainer').hide();
        filterJobs();
    }); 

    loadJobs(listingData);
});