function initGuides(){
    const testImage = document.getElementById("Electricity");

    function horizontalInPercent(v){
        return v/testImage.clientWidth*100;
    }
    
    function verticalInPercent(v){
        return v/testImage.clientHeight*100;
    }

    const posPercentDisplay = document.createElement("div");
    document.body.appendChild(posPercentDisplay);
    posPercentDisplay.style.position = "fixed";
    posPercentDisplay.textContent = "";
    posPercentDisplay.style.width = "fit-content";
    posPercentDisplay.style.height = "fit-content";
    posPercentDisplay.style.pointerEvents = "none";
    posPercentDisplay.style.userSelect = "none";
    posPercentDisplay.style.zIndex = "8888888888888";
    posPercentDisplay.style.color = "black";
    posPercentDisplay.style.fontSize = "20px";
    posPercentDisplay.style.right = "20px";

    
    const horizontalGuide = document.createElement("div");
    horizontalGuide.classList.add("horizontal-guide");
    horizontalGuide.style.display = "none";
    document.body.appendChild(horizontalGuide);
    
    const verticalGuide = document.createElement("div");
    verticalGuide.classList.add("vertical-guide");
    verticalGuide.style.display = "none";
    document.body.appendChild(verticalGuide);

    let prevHightlighted = null;

    function moveGuides(event){
        console.log("move");
        function horizontalInPercent2(v){
            return v/event.target.clientWidth*100;
        }
        
        function verticalInPercent2(v){
            return v/event.target.clientHeight*100;
        }

        horizontalGuide.style.top = event.pageY + "px";
        verticalGuide.style.left = event.pageX + "px";
        posPercentDisplay.textContent = `(${horizontalInPercent2(event.offsetX).toFixed(2)}, ${verticalInPercent2(event.offsetY).toFixed(2)})`
    }
    
    let isMoving = false;

    function toggleMove(event){
        moveGuides(event);

        function horizontalInPercent2(v){
            return v/event.target.clientWidth*100;
        }
        
        function verticalInPercent2(v){
            return v/event.target.clientHeight*100;
        }

        if(!isMoving){
            testImage.addEventListener("mousemove", moveGuides);
            document.body.classList.add("nocursor");
        }else{
            testImage.removeEventListener("mousemove", moveGuides);
            document.body.classList.remove("nocursor");
            console.log(`(${horizontalInPercent2(event.offsetX).toFixed(2)}, ${verticalInPercent2(event.offsetY).toFixed(2)})`);
        }

        isMoving = !isMoving;
    }

    let isActive = false;

    function toggleGuides(){
        if(isActive){
            horizontalGuide.style.display = "none";
            verticalGuide.style.display = "none";
            window.removeEventListener("mousedown", toggleMove);
            testImage.removeEventListener("mousemove", moveGuides);
            document.body.classList.remove("nocursor");
        }else{
            horizontalGuide.style.removeProperty("display");
            verticalGuide.style.removeProperty("display");
            window.addEventListener("mousedown", toggleMove);
        }

        isActive = !isActive;
    }

    window.addEventListener("keydown", (event)=>{
        if(event.key === "k" && event.altKey){
            toggleGuides();
        }
    })

}
initGuides();