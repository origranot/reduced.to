import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { ShortenerController } from "./shortener.controller";
import { ShortenerService } from "./shortener.service";
import { Test } from "@nestjs/testing";
import { ShortenerDTO } from "./dto";
const moduleMocker = new ModuleMocker(global);

//TODO add dependencies and tests for ShortenerController.shortener
describe("ShortenerController", () => {
  let controller: ShortenerController;

  let mockRequest = {
    originalUrl:
      "https://www." + Math.random().toString(36).substring(7) + ".com",
  } as ShortenerDTO;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ShortenerController],
    })
      .useMocker((token) => {
        if (token === ShortenerService) {
          return {
            findAll: jest.fn().mockResolvedValue({ newUrl: "A new url" }),
          };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = moduleRef.get(ShortenerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
