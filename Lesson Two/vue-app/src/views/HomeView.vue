<script setup lang="ts">
import { useTheme } from 'vuetify'
import LinkButton from '../components/LinkButton.vue'

const theme = useTheme()

const links = [
  { label: 'Portfolio', url: 'https://kelseymalvey.com', icon: 'mdi-monitor', iconColor: 'blue-lighten-2' },
  { label: 'Dribbble', url: 'https://dribbble.com', icon: 'mdi-basketball', iconColor: 'deep-orange-lighten-1' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/kelseymalvey', icon: 'mdi-linkedin', iconColor: 'light-blue-lighten-1' },
  { label: 'Email', url: 'mailto:kelsey.malvey@slaloom.com', icon: 'mdi-email-outline', iconColor: 'amber-lighten-1' },
]

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
  <v-app>
    <v-main class="bg-background">
      <v-container class="fill-height py-4" fluid>
        <v-row justify="center" class="w-100">
          <v-col cols="12" class="d-flex justify-end pa-0 mb-2" style="max-width: 360px">
            <v-btn
              :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              variant="tonal"
              size="small"
              :aria-label="theme.global.current.value.dark ? 'Switch to light mode' : 'Switch to dark mode'"
              @click="toggleTheme"
            />
          </v-col>

          <v-col cols="12" class="pa-0">
            <v-card class="mx-auto" max-width="360" rounded="lg" elevation="8">
              <v-card-text class="pa-5 text-center">
                <v-avatar size="72" color="primary" class="mb-3 text-h5 font-weight-bold">
                  KM
                </v-avatar>

                <h1 class="text-h4 font-weight-bold mb-1">Kelsey M</h1>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Customer experience strategist, curious human, and believer in making things feel a little more human.
                </p>

                <LinkButton
                  v-for="link in links"
                  :key="link.label"
                  :label="link.label"
                  :url="link.url"
                  :icon="link.icon"
                  :icon-color="link.iconColor"
                />

                <p class="text-caption text-medium-emphasis mt-3 mb-0">
                  Made with <span class="text-primary">&#9824;</span> and Copilot
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
