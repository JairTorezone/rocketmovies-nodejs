exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.text("name");
    table.text("email");
    table.text("password");
    table.text("avatar");

    table.timestamp("created-at").default(knex.fn.now());
    table.timestamp("updated-at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("users");
