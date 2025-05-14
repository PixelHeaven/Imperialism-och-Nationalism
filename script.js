document.addEventListener('DOMContentLoaded', function() {
    // Dark mode switch
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
    
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }    
    }
    
    toggleSwitch.addEventListener('change', switchTheme, false);
    
    // Table of Contents generation
    const toc = document.getElementById('toc');
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = heading.textContent;
            a.href = `#${section.id}`;
            li.appendChild(a);
            toc.appendChild(li);
        }
    });
    
    // Active section highlighting in TOC
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.7
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const tocLink = document.querySelector(`.table-of-contents a[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                document.querySelectorAll('.table-of-contents a').forEach(link => {
                    link.classList.remove('active');
                });
                if (tocLink) {
                    tocLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Back to Top button
    const toTopButton = document.getElementById('toTopBtn');
    
    toTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show Back to Top button when scrolling down
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            toTopButton.style.opacity = '1';
        } else {
            toTopButton.style.opacity = '0';
        }
    });
    
    // Image lazy loading with fade-in effect
    const images = document.querySelectorAll('.bild');
    
    images.forEach(img => {
        img.style.transition = "opacity 0.5s ease-in-out";
        // Add loaded class immediately to make images visible
        img.classList.add("loaded");
    });
    
    // Improved Quiz functionality
    const quizContainer = document.querySelector('.quiz-container');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const submitButton = document.getElementById('submit-answer');
    const quizFeedback = document.getElementById('quiz-feedback');
    const quizProgress = document.getElementById('quiz-progress');
    
    // Only initialize quiz if elements exist
    if (quizContainer && quizQuestion && quizOptions && submitButton && quizFeedback && quizProgress) {
        // Expanded quiz questions with explanations
        const quizQuestions = [
            {
                question: "Vilket område kallades för 'juvelen i kronan' i det Brittiska imperiet?",
                options: ["Australien", "Kanada", "Indien", "Sydafrika"],
                answer: 2,
                explanation: "Indien kallades 'juvelen i kronan' eftersom det var den mest värdefulla brittiska kolonin, både ekonomiskt och strategiskt."
            },
            {
                question: "Vilket av följande var inte en drivkraft bakom imperialismen?",
                options: ["Ekonomiska intressen", "Spridning av demokrati", "Prestige och makt", "Råvarutillgång"],
                answer: 1,
                explanation: "Även om europeiska makter ofta hävdade att de spred 'civilisation', var demokratispridning sällan ett mål. De vanligaste drivkrafterna var ekonomiska intressen, prestige, och strategiska fördelar."
            },
            {
                question: "Vilka två länder enades under 1800-talet tack vare nationalism?",
                options: ["Frankrike och Spanien", "Tyskland och Italien", "Österrike och Ungern", "Sverige och Norge"],
                answer: 1,
                explanation: "Tyskland enades 1871 under Otto von Bismarcks ledning. Italien enades under processen Risorgimento mellan 1815-1871."
            },
            {
                question: "Vad kallas tävlingen mellan Europas stormakter om att kolonisera Afrika?",
                options: ["Det stora spelet", "Kapplöpningen om Afrika", "Kolonialkriget", "Den sista erövringen"],
                answer: 1,
                explanation: "Kapplöpningen om Afrika (ca 1881-1914) var en period då europeiska länder intensivt tävlade om att kolonisera Afrikas landområden, vilket ledde till att nästan hela kontinenten blev koloniserad."
            },
            {
                question: "Vilken teknisk uppfinning bidrog starkt till att Europeiska länder kunde kontrollera stora kolonier?",
                options: ["Telegrafen", "Flygplanet", "Bilen", "Datorn"],
                answer: 0,
                explanation: "Telegrafen möjliggjorde snabb kommunikation över stora avstånd, vilket var avgörande för att effektivt kunna administrera kolonier på andra kontinenter."
            },
            {
                question: "Vilket år hölls Berlinkonferensen där europeiska länder delade upp Afrika?",
                options: ["1854-1855", "1884-1885", "1904-1905", "1914-1915"],
                answer: 1,
                explanation: "Berlinkonferensen 1884-1885 fastställde regler för hur europeiska makter skulle dela upp Afrika, utan att något afrikanskt folk tillfrågades."
            },
            {
                question: "Vilken rörelse växte fram som motreaktion mot imperialismen i kolonierna?",
                options: ["Liberalismen", "Nationalismen", "Kommunismen", "Konservatismen"],
                answer: 1,
                explanation: "Nationalism växte fram i många kolonier som en reaktion mot utländskt styre. Lokala folkgrupper började definiera sig själva som nationer med rätt till självbestämmande."
            },
            {
                question: "Vad var 'White Man's Burden'?",
                options: ["En vetenskaplig teori", "En militär strategi", "En rasistisk idé om kolonialismens syfte", "En kolonial skatt"],
                answer: 2,
                explanation: "'White Man's Burden' var en idé populariserad av Rudyard Kiplings dikt, som hävdade att västerlänningar hade en plikt att 'civilisera' icke-västerländska folk. Idén användes för att rättfärdiga kolonialismen."
            },
            {
                question: "Vilket land var först med att industrialiseras?",
                options: ["Frankrike", "Tyskland", "USA", "Storbritannien"],
                answer: 3,
                explanation: "Storbritannien var först med att genomgå den industriella revolutionen, vilket gav landet ett teknologiskt försprång som bidrog till dess kolonialexpansion."
            },
            {
                question: "Vilket av följande länder var INTE en stor kolonial makt?",
                options: ["Belgien", "Spanien", "Schweiz", "Portugal"],
                answer: 2,
                explanation: "Schweiz hade aldrig några betydande kolonier. Till skillnad hade Belgien Kongo, Spanien hade kolonier i Amerika och Asien, och Portugal hade kolonier i Afrika, Asien och Sydamerika."
            },
            {
                question: "Kring 1914, hur stor andel av jordens landyta kontrollerades av europeiska kolonialimperier?",
                options: ["Omkring 25%", "Omkring 50%", "Omkring 70%", "Omkring 85%"],
                answer: 3,
                explanation: "Vid första världskrigets början kontrollerade europeiska makter omkring 85% av jordens landyta genom kolonier, protektorat och andra former av imperialism."
            },
            {
                question: "Vilken kolonial stormakt administrerade Sydafrika, Egypten och Indien?",
                options: ["Frankrike", "Storbritannien", "Tyskland", "Nederländerna"],
                answer: 1,
                explanation: "Storbritannien var den största kolonialmakten och kontrollerade bland annat Sydafrika, Egypten och Indien, vilka var strategiskt viktiga områden för det brittiska imperiet."
            },
            {
                question: "Vad var en konsekvens av nationalism i Centraleuropa under 1800-talet?",
                options: ["Ökad stabilitet i regionen", "Splittring av Österrike-Ungern", "Stärkt monarki", "Färre krig"],
                answer: 1,
                explanation: "Nationalismen ledde till ökade spänningar mellan olika folkgrupper i multinationella imperier som Österrike-Ungern, vilket så småningom bidrog till imperiets upplösning efter första världskriget."
            },
            {
                question: "Vilket av dessa krigsutbrott påverkades starkt av nationalism?",
                options: ["Krimkriget", "Amerikanska inbördeskriget", "Första världskriget", "Napoleonkrigen"],
                answer: 2,
                explanation: "Första världskriget utlöstes delvis av nationalistiska spänningar på Balkan. Nationalism var en viktig bidragande faktor till krigsutbrottet 1914."
            },
            {
                question: "Vilket begrepp beskriver principen att folkgrupper bör styras av sin egen nation?",
                options: ["Nationalchauvinism", "Självbestämmande", "Rasism", "Imperialism"],
                answer: 1,
                explanation: "Självbestämmande är principen att folkgrupper har rätt att bestämma över sitt eget öde och politiska tillhörighet, vilket blev en central tanke i den nationalism som växte fram."
            }
        ];

        let currentQuestion = 0;
        let score = 0;
        let selectedOption = null;
        let quizStarted = false;
        let questionsShuffled = false;
        let quizQuestionsInUse = [];

        // Function to shuffle quiz questions
        function shuffleQuestions() {
            if (!questionsShuffled) {
                for (let i = quizQuestions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [quizQuestions[i], quizQuestions[j]] = [quizQuestions[j], quizQuestions[i]];
                }
                questionsShuffled = true;
            }
        }

        // Show quiz start screen
        function showQuizStart() {
            quizQuestion.textContent = "Testa dina kunskaper om Imperialism och Nationalism";
            
            quizOptions.innerHTML = `
                <div class="quiz-intro">
                    <p>Detta quiz innehåller frågor om imperialism och nationalism under 1800-talet.</p>
                    <p>Välj svårighetsgrad:</p>
                    <div class="difficulty-selection">
                        <button class="difficulty-btn" data-questions="5">Lätt (5 frågor)</button>
                        <button class="difficulty-btn" data-questions="10">Mellan (10 frågor)</button>
                        <button class="difficulty-btn" data-questions="15">Svår (15 frågor)</button>
                    </div>
                </div>
            `;
            
            submitButton.textContent = "Starta Quiz";
            submitButton.onclick = function() {
                // Default to all questions if no difficulty selected
                startQuiz(15);
            };
            
            // Add difficulty selection functionality
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    const numQuestions = parseInt(this.dataset.questions);
                    submitButton.onclick = function() {
                        startQuiz(numQuestions);
                    };
                });
            });
            
            quizFeedback.style.display = 'none';
            quizProgress.innerHTML = '';
        }

        // Start quiz with selected number of questions
        function startQuiz(numQuestions) {
            shuffleQuestions();
            quizStarted = true;
            currentQuestion = 0;
            score = 0;
            
            // Create a copy of the shuffled questions for this quiz session
            quizQuestionsInUse = quizQuestions.slice(0, numQuestions);
            
                        showQuestion(0);
            submitButton.textContent = "Svara";
            submitButton.onclick = checkAnswer;
        }

        // Display quiz question
        function showQuestion(index) {
            const question = quizQuestionsInUse[index];
            quizQuestion.textContent = `Fråga ${index + 1}: ${question.question}`;
            
            quizOptions.innerHTML = '';
            question.options.forEach((option, i) => {
                const optionDiv = document.createElement('div');
                optionDiv.classList.add('quiz-option');
                optionDiv.textContent = option;
                optionDiv.dataset.index = i;
                
                optionDiv.addEventListener('click', function() {
                    document.querySelectorAll('.quiz-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    this.classList.add('selected');
                    selectedOption = parseInt(this.dataset.index);
                });
                
                quizOptions.appendChild(optionDiv);
            });
            
            // Update progress indicator
            const progressPercentage = ((index) / quizQuestionsInUse.length) * 100;
            const progressBar = document.createElement('div');
            progressBar.id = 'quiz-progress-bar';
            progressBar.style.width = `${progressPercentage}%`;
            
            quizProgress.innerHTML = '';
            quizProgress.appendChild(progressBar);
            
            // Add text indicator of progress
            const progressText = document.createElement('div');
            progressText.className = 'progress-text';
            progressText.textContent = `Fråga ${index + 1} av ${quizQuestionsInUse.length}`;
            quizProgress.appendChild(progressText);
            
            // Reset feedback and selection
            quizFeedback.style.display = 'none';
            quizFeedback.className = 'quiz-feedback';
            selectedOption = null;
            submitButton.disabled = false;
            submitButton.textContent = "Svara";
        }

        // Check answer and provide feedback
        function checkAnswer() {
            if (selectedOption === null) {
                alert('Välj ett alternativ först!');
                return;
            }
            
            const correctAnswer = quizQuestionsInUse[currentQuestion].answer;
            const explanation = quizQuestionsInUse[currentQuestion].explanation;
            
            if (selectedOption === correctAnswer) {
                quizFeedback.innerHTML = `
                    <p class="feedback-result">✓ Rätt svar! Bra jobbat!</p>
                    <p class="feedback-explanation">${explanation}</p>
                `;
                quizFeedback.className = 'quiz-feedback correct';
                score++;
                
                // Highlight correct answer
                document.querySelectorAll('.quiz-option')[correctAnswer].classList.add('correct-answer');
            } else {
                quizFeedback.innerHTML = `
                    <p class="feedback-result">✗ Fel svar.</p>
                    <p>Det rätta svaret är: ${quizQuestionsInUse[currentQuestion].options[correctAnswer]}</p>
                    <p class="feedback-explanation">${explanation}</p>
                `;
                quizFeedback.className = 'quiz-feedback incorrect';
                
                // Highlight correct and incorrect answers
                document.querySelectorAll('.quiz-option')[selectedOption].classList.add('incorrect-answer');
                document.querySelectorAll('.quiz-option')[correctAnswer].classList.add('correct-answer');
            }
            
            quizFeedback.style.display = 'block';
            submitButton.textContent = "Nästa fråga";
            submitButton.onclick = nextQuestion;
        }

        // Move to next question
        function nextQuestion() {
            currentQuestion++;
            
            if (currentQuestion < quizQuestionsInUse.length) {
                showQuestion(currentQuestion);
                submitButton.onclick = checkAnswer;
            } else {
                showQuizResults();
            }
        }

        // Show final quiz results
        function showQuizResults() {
            const percentage = Math.round((score / quizQuestionsInUse.length) * 100);
            let resultMessage;
            
            if (percentage >= 80) {
                resultMessage = "Utmärkt! Du har mycket bra kunskaper om imperialism och nationalism.";
            } else if (percentage >= 60) {
                resultMessage = "Bra jobbat! Du har god förståelse för ämnet.";
            } else if (percentage >= 40) {
                resultMessage = "Du har grundläggande kunskaper. Fortsätt läsa för att lära dig mer.";
            } else {
                resultMessage = "Du kan förbättra dina kunskaper genom att studera ämnet mer.";
            }
            
            quizQuestion.textContent = "Quiz avslutad!";
            
            quizOptions.innerHTML = `
                <div class="quiz-result">
                    <h3>Din poäng: ${score} av ${quizQuestionsInUse.length} (${percentage}%)</h3>
                    <p class="result-message">${resultMessage}</p>
                    <div class="result-chart">
                        <div class="result-bar" style="width: ${percentage}%;">${percentage}%</div>
                    </div>
                </div>
            `;
            
            quizFeedback.innerHTML = `
                <p>Tack för att du gjorde quizet! Du kan göra om det för att testa dina kunskaper igen.</p>
            `;
            quizFeedback.className = 'quiz-feedback';
            quizFeedback.style.display = 'block';
            
            submitButton.textContent = "Gör om quizet";
            submitButton.onclick = showQuizStart;
            
            // Complete progress bar
            const progressBar = document.createElement('div');
            progressBar.id = 'quiz-progress-bar';
            progressBar.style.width = '100%';
            quizProgress.innerHTML = '';
            quizProgress.appendChild(progressBar);
        }

        // Start the quiz with welcome screen
        showQuizStart();
    }
});
