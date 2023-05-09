@Controller('menu')
export class MenuController {
  private readonly logger = new Logger(MenuController.name);
  constructor(private readonly menuService: MenuService) {}

}
