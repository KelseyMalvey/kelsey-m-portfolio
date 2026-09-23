<script setup lang="ts">
interface Props {
  label: string
  url: string
  icon: string
  iconColor?: string
}

defineProps<Props>()
</script>

<template>
  <v-btn
    :href="url"
    block
    variant="tonal"
    color="primary"
    size="small"
    rounded="sm"
    class="mb-2"
    :target="url.startsWith('http') ? '_blank' : undefined"
    :rel="url.startsWith('http') ? 'noreferrer' : undefined"
  >
    <v-icon start :icon="icon" size="small" :color="iconColor || 'primary'" />
    {{ label }}
  </v-btn>
</template>
