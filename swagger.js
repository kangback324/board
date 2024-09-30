const swaggerUi = require("swagger-ui-express")
const swaggereJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "간단한 게시판 API",
      description:
        "프로젝트 설명 express 를 활용한 간단한 게시판 api 입니다",
    },
    servers: [
      {
        url: "http://localhost:3000", // 요청 URL
      },
    ],
    tags: [
        {
          name: "Board", // 접혀 있는 섹션의 새로운 이름
          description: "게시판 관련 API"
        },
    ]
  },
  apis: ["./routes/*.js"], //Swagger 파일 연동
}
const specs = swaggereJsdoc(options)

module.exports = { swaggerUi, specs }