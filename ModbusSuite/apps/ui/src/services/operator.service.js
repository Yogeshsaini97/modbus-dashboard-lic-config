class OperatorService {

    KEY = "current_operator";

    save(name) {

        localStorage.setItem(this.KEY, name);

    }

    get() {

        return localStorage.getItem(this.KEY) || "Unassigned";

    }

}

export default new OperatorService();