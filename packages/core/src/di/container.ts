import { container, type DependencyContainer } from 'tsyringe'

const coreContainer: DependencyContainer = container.createChildContainer()

export const getCoreContainer = (): DependencyContainer => {
  return coreContainer
}

export const registerCoreDefaults = (): void => {
  // no default registrations at step 1
}

