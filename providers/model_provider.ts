import type { ApplicationService } from '@adonisjs/core/types'
import emitter from '@adonisjs/core/services/emitter'
import { BaseModel } from '@adonisjs/lucid/orm'

export default class ModelProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   * doc: https://adocasts.com/lessons/how-to-use-adonisjs-model-hooks-to-log-all-user-actions
   */
  async boot() {
    const boot = BaseModel.boot

    BaseModel.boot = function() {
      if (this.booted) return

      boot.call(this)

      this.before('create', (item) => {
        emitter.emit(`${item.constructor.name}:before:create:model`, item)
        emitter.emit(`${item.constructor.name}:before:save:model`, item)
      })

      this.after('create', (item) => {
        emitter.emit(`${item.constructor.name}:after:create:model`, item)
        emitter.emit(`${item.constructor.name}:after:save:model`, item)
      })

      this.before('update', (item) => {
        emitter.emit(`${item.constructor.name}:before:update:model`, item)
        emitter.emit(`${item.constructor.name}:before:save:model`, item)
      })

      this.after('update', (item) => {
        emitter.emit(`${item.constructor.name}:after:update:model`, item)
        emitter.emit(`${item.constructor.name}:after:save:model`, item)
      })

      this.before('delete', (item) => {
        emitter.emit(`${item.constructor.name}:before:delete:model`, item)
      })

      this.after('delete', (item) => {
        emitter.emit(`${item.constructor.name}:after:delete:model`, item)
      })
    }
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}