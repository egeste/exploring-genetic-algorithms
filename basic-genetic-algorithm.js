// Problem:
// Solve for express() = 1337
// There are theoretically an infinite amount of potential solutions

import _ from 'lodash'

const TARGET = 1337
const chromosomes = ['x', 'y', 'z']

let best = 0
let population = []
let generation = 0

// Seed an initial population
_.times(4, () => {
  population.push({
    fitness: undefined,
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 100
  })
})

const express = ({ x, y, z }) => {
  return x + y * z
}

// Determine the fitness of an individual
const determineFitness = individual => {
  // The expression of this individuals chromosomes
  let expression = express(individual)

  // The difference between the individuals expression and the target
  let difference =  TARGET - expression

  // The fitness score of the individuals expression
  let fitness = 1 / difference

  // Assign the individuals fitness
  individual.fitness = fitness

  // And return the individual
  return individual
}

// Randomly select 2 individuals to breed, weighted by their fitness
const selectBreeders = individuals => {
  let breeders = []

  // Calculate the total fitness of all individuals
  let totalFitness = individuals.reduce(((memo, individual) => memo + individual.fitness), 0)

  // Until we find 2 individuals...
  do {

    // Get a random individual
    let index = Math.floor(Math.random() * individuals.length)
    let individual = individuals[index]
    let fitnessPercent = individual.fitness / totalFitness

    // Allow it to breed if its fitness score > random
    if (fitnessPercent > Math.random()) breeders.push(individual)

  } while (breeders.length < population.length)

  // And return our new parents
  return breeders
}

// Breed two candidates
const breed = individuals => {
  let children = []

  // For half the individuals in this breeding set
  for (let i = 0; i < individuals.length; i = i + 2) {

    // Select random individuals
    let mom = individuals[Math.floor(Math.random() * individuals.length)]
    let dad = individuals[Math.floor(Math.random() * individuals.length)]

    // Allow them to produce exactly 2 children
    _.times(2, () => {
      // Create a new child
      let child = { fitness: undefined }

      // For each chromosome
      chromosomes.forEach(chromosome => {
        (Math.random() < 0.33) ? // 1/3 of the time
          (child[chromosome] = (mom[chromosome] + dad[chromosome]) / 2) : // average the parents chromosomes together
          (child[chromosome] = (Math.random() > 0.5) ? mom[chromosome] : dad[chromosome]) // assign a chromosome from a parent
      })

      // Push the child into our array
      children.push(child)
    })
  }

  return children
}

// Mutate an individual
const mutate = individual => {
  chromosomes.forEach(chromosome => {
    if (Math.random() < 0.1) { // 50% of the time
      let mutation = Math.random() * 100
      individual[chromosome] = (Math.random() < 0.5) ?
        (individual[chromosome] + mutation) :
        (individual[chromosome] - mutation)
    }
  })
  return individual
}

do {
  generation++
  population.forEach(determineFitness)

  let mostFit
  let { fitness } = mostFit = population.sort((a, b) => {
    return a.fitness > b.fitness
  })[0]

  if (fitness > best) {
    best = fitness
    let expression = express(mostFit)
    console.log('=== Generation', generation, best, expression)
  }

  // Select breeders
  let breeders = selectBreeders(population)

  // Breed and mutate
  population = breed(breeders).map(mutate)
} while (best < 1000)
