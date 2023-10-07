import $ from 'jquery';
import json from '../data/data.json'

$(function() {
    const listingData = json;
    const jobsContainer = $('.listingCards');
    console.log(listingData[0].company);


    function createJob(data) {
        const languagesFilters = data.languages.map(language => `<div class="filter">${language}</div>`).join('');
        const toolsFilters = data.tools.map(tool => `<div class="filter">${tool}</div>`).join('');
        return `
            <div class="job">
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

    function loadJobs(data) {
        data.forEach(job => {
            jobsContainer.append(createJob(job));
        });
    }

    loadJobs(listingData);
});