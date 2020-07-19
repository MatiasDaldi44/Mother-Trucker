$(document).ready(() => {
  const postContainer = $("#postContainer");
  const foodTypeSelect = $("#foodTypes");
  const submitForm = $("#submitBtn");
  let userEmail, userID, category;

  $.get("/api/user_data").then(data => {
    userID = data.id;
    userEmail = data.email;
    $(".member-name").text(userEmail);
    getPosts(userID);
  });

  async function getPosts(userID) {
    const posts = await $.get(`/api/foodtrucks/user/${userID}`);
    const { Posts } = posts;
    postContainer.empty();
    
    if (Posts.length === 0) {
      let noPostMsg = `<h4 class="has-text-centered	is-italic">User has no current posts. Add a post to change this!</h4>`
      postContainer.append(noPostMsg);
    } else {
      for (let i = 0; i < Posts.length; i++) {
        const { truck_name, street_address, city, state, zipcode, time_start, time_end, id, CategoryId } = Posts[i];
        let truckerPost = `
        <div class="column is-full">
          <div class="box">
              <div class="media-content">
                  <div class="content">
                      <p class="title mb-2">${truck_name} <span class="subtitle is-pulled-right is-italic" id="categoryLine-${id}"></span></p>
                      <div class="descText">
                        <i class="fas fa-map-marker-alt"></i> ${street_address}, ${city}, ${state} ${zipcode}<br>
                      </div>
                      <div class="descText">
                          <i class="fas fa-clock"></i><span class="mx-1">${time_start} to ${time_end}</span>
                      </div>
                  </div>
                  <nav class="level">
                      <div class="level-left">
                          <button id="delete-post" class="level-item button is-link is-rounded" data-id=${id}>Delete Post</button>
                          <button id="update-post" class="button is-info is-rounded" data-id=${id}>Update Post</button>
                      </div>
                  </nav>
              </div>
          </div>
        </div>
        `
        postContainer.append(truckerPost);
        let categoriesArr = await $.get("/api/categories");
        let matchedCategory = await categoriesArr.filter(item => item.id === CategoryId)
        category = matchedCategory[0].food_type;
        $(`#categoryLine-${id}`).text(category);

      }
    }
  }

  submitForm.on("click", event => {
    event.preventDefault();

    const truckerName = capitalizeWords($("#trucker_name").val().trim());
    const address = capitalizeWords($("#trucker_addy").val().trim());
    const city = capitalizeWords($("#trucker_city").val().trim());
    const state = capitalizeWords($("#trucker_state").val().trim());
    const zipcode = $("#trucker_zipcode").val().trim();
    const foodTypeId = $("#foodTypes option:selected").data("id");
    const startTime = $("#startTime option:selected").val();
    const endTime = $("#endTime option:selected").val();

    const newPost = {
      truck_name: truckerName,
      street_address: address,
      city: city,
      state: state,
      zipcode: zipcode,
      time_start: startTime,
      time_end: endTime,
      UserId: userID,
      CategoryId: foodTypeId
    };
    
    $.ajax("/api/foodtrucks", {
      type: "POST",
      data: newPost
    }).then(() => location.reload());
  });

  getCategories = () => {
    $.get("/api/categories").then(data => {
      let rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        const { id, food_type } = data[i];
        let listOption = `
          <option data-id="${id}">${food_type}</option>
        `
        rowsToAdd.push(listOption);
      }
      foodTypeSelect.empty();
      foodTypeSelect.append(rowsToAdd);
    });
  };

  getCategories();
  getPosts(userID);

});

$(document).on("click", "#delete-post", function() {
  let id = $(this).data("id");
  console.log("i clicked");

  $.ajax(`/api/foodtrucks/posts/${id}`, {
      type: "DELETE"
  }).then(() => location.reload());
});

$(document).on("click", "#update-post", function() {
  let id = $(this).data("id");
  window.location.href = `/foodtrucks?post_id=${id}`;
});

capitalizeWords = str => str.replace(/\w\S*/g, 
  txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());