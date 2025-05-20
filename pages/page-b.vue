


<script setup>
const cookie = useCookie('myCookieTest')

const cookie2 = useCookie('myCookieTestCKKey')

</script>

<template>
  <div>
    <h1>Page B - Get Cookie</h1>
    <p>Cookie value: {{ cookie || 'No cookie found!' }}</p>
    <p>Cookie2 value: {{ cookie2 || 'No cookie found' }}</p>

    <NuxtLink to="/page-a">Back to Page A</NuxtLink>
  </div>
</template>