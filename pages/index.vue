<template>
<div class="row">
  <div class="col">
    <label>
      Genre
    </label>
    <select class="form-select">
      <option value="name">Comedy</option>
      <option value="year">Sitcom</option>
      <option value="rating">Horror</option>
    </select>
  </div>
  <div class="col">
    <label>Year</label>
    <select class="form-select">
      <option value="name">2010</option>
      <option value="name">2011</option>
      <option value="name">2012</option>
      <option value="name">2013</option>
      <option value="name">2014</option>
      <option value="name">2015</option>
      <option value="name">2016</option>
    </select>
  </div>
  <div class="col">
    <label>Rating</label>
    <select class="form-select">
      <option value="name">6+</option>
      <option value="name">12+</option>
      <option value="name">16+</option>
      <option value="name">18+</option>
    </select>
  </div>
  <div class="col mt-4">
    <button class="btn btn-outline-dark" type="submit">Reset</button>
  </div>
</div>
  <div class="row row-cols-1 row-cols-md-3 g-4">

    <div class="col">
      <div class="card mt-4" style="width: 14rem; top: 10px;">
        <img src="https://m.media-amazon.com/images/I/51ISve-1n1S.jpg" class="card-img-top" alt="Фото">
        <div class="card-body">
          <h5 class="card-title">Matrix</h5>
          <p class="card-text">Rating: 2.1</p>
          <p class="card-text">Year: 2024</p>
          <p class="card-text">Genre: Comedy</p>
          <a href="#" class="btn btn-primary me-2">Watch</a>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
</script>