import StorageService from "./storage.service";

class OperatorService {

    KEY = "current_operator";

    save(name) {

        StorageService.save(this.KEY, name);

    }

    get() {

        return StorageService.get(this.KEY, "Unassigned");

    }

}

export default new OperatorService();
