<template>
    <div class="rating">
      <span
        v-for="star in stars"
        :key="star"
        class="star"
        :class="{ active: star <= hoverIndex, selected: star <= rating }"
        @mouseover="setHover(star)"
        @mouseleave="resetHover"
        @click="setRating(star)"
      >
        ★
      </span>
      <button type="button" class="btn btn-primary">Submit</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        stars: [1, 2, 3, 4, 5],
        rating: 0,
        hoverIndex: 0,
      };
    },
    methods: {
      setHover(index) {
        this.hoverIndex = index;
      },
      resetHover() {
        this.hoverIndex = 0;
      },
      setRating(index) {
        this.rating = index;
      },
    },
  };
  </script>
  
  <style scoped>
  .rating {
    display: flex;
    font-size: 2rem;
    cursor: pointer;
  }
  
  .star {
    color: #ccc;
    transition: color 0.2s;
  }
  
  .star.active {
    color: rgb(146, 197, 255);
  }
  
  .star.selected {
    color: rgb(0, 119, 255);
  }
  </style>
  