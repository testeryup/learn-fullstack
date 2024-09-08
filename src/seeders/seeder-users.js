'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'example@example.com',
        password: '123456',
        firstName: 'Dat',
        lastName: 'Manh',
        address: 'Ha Noi',
        phonenumber: '0987654321',
        gender: 1,
        image: '/image/olala.jpg',
        roleId: 'ROLE',
        positionId: 'R1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
