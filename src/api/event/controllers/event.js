"use strict";
/**
 *  event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // GET TOTAL EVENTS CREATED
  count(ctx) {
    const { query } = ctx.request;
    return strapi.entityService.count("api::event.event", query);
  },
  //Find with populate ----------------------------------------
  async find(ctx) {
    const populateList = ["image", "user"];
    // Push any additional query params to the array
    populateList.push(ctx.query.populate);
    ctx.query.populate = populateList.join(",");
    // console.log(ctx.query)
    const content = await super.find(ctx);
    return content;
  },

  // Create user event----------------------------------------
  async create(ctx) {
    let entity;
    ctx.request.body.data.user = ctx.state.user;
    // console.log(ctx.request.body.data);
    // entity = await super.create(ctx);
    entity = await strapi.entityService.create("api::event.event", {
      data: {
        ...ctx.request.body.data,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      },
      fields: [
        "name",
        "description",
        "address",
        "venue",
        "date",
        "performers",
        "date",
        "time",
        "slug",
      ],
      // populate: { image: true },
    });
    return entity; /**it's important to have a return */
  },
  // Update user event----------------------------------------
  async update(ctx) {
    let entity;

    const { id } = ctx.params;
    const query = {
      filters: {
        id: id,
        user: { id: ctx.state.user.id },
      },
    };
    const events = await this.find({ query: query });

    if (!events.data || !events.data.length) {
      return ctx.unauthorized(`You can't update this entry`);
    }
    entity = await super.update(ctx);
    return entity;
  },

  // Delete a user event----------------------------------------
  async delete(ctx) {
    const { id } = ctx.params;
    const query = {
      filters: {
        id: id,
        user: { id: ctx.state.user.id },
      },
    };
    const events = await this.find({ query: query });
    if (!events.data || !events.data.length) {
      return ctx.unauthorized(`You can't delete this entry`);
    }
    const response = await super.delete(ctx);
    return response;
  },
  // Get logged in users----------------------------------------
  // async me(ctx) {
  //   const user = ctx.state.user;
  //   if (!user) {
  //     return ctx.badRequest(null, [
  //       { messages: [{ id: "No authorization header was found" }] },
  //     ]);
  //   }
  //   const query = {
  //     filters: {
  //       user: { id: user.id },
  //     },
  //   };
  //   const data = await this.find({ query: query });
  //   if (!data) {
  //     return ctx.notFound();
  //   }
  //   const sanitizedEntity = await this.sanitizeOutput(data, ctx);
  //   return this.transformResponse(sanitizedEntity);
  // },
  //   GET EVENTS CREATED BY AN AUTHENTICATED USER
  async userEvents(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { message: [{ id: "No authorization header was found" }] },
      ]);
    }

    const entity = await strapi.entityService.findMany("api::event.event", {
      filters: { user: user },
      populate: "*",
    });
    if (!entity) {
      return ctx.notFound();
    }
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return sanitizedEntity;
  },
}));
