// home_screen.dart
import 'package:flutter/material.dart';
import 'package:confetti/confetti.dart'; // You'll need to add this dependency

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ConfettiController _confettiController = ConfettiController(duration: const Duration(seconds: 1));
  String _currentPrompt = "Tap Truth or Dare to begin!";
  bool _isTruth = true;
  final List<String> _themes = ['Fun', 'Friends', 'Party', 'Challenging'];
  String _selectedTheme = 'Fun';

  // Temporary lists until we integrate AI
  final List<String> _truths = [
    "What's the most embarrassing thing you've done in front of a crush?",
    "If you could switch lives with anyone for a day, who would it be?",
    "What's a secret you've never told anyone?",
    "What's the weirdest dream you've ever had?",
  ];

  final List<String> _dares = [
    "Do your best impression of a famous person.",
    "Sing the chorus of your favorite song out loud.",
    "Dance like nobody's watching for 30 seconds.",
    "Tell a joke and make everyone laugh.",
  ];

  @override
  void initState() {
    super.initState();
    _confettiController.stop();
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  void _generatePrompt(bool isTruth) {
    setState(() {
      _isTruth = isTruth;
      final random = Random();
      
      if (isTruth) {
        _currentPrompt = _truths[random.nextInt(_truths.length)];
      } else {
        _currentPrompt = _dares[random.nextInt(_dares.length)];
      }
      
      _confettiController.play();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TruthDare AI'),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.purple.shade400,
                  Colors.deepPurple.shade700,
                ],
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Theme selector
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Select Theme:",
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            children: _themes.map((theme) {
                              return FilterChip(
                                label: Text(theme),
                                selected: _selectedTheme == theme,
                                onSelected: (selected) {
                                  setState(() {
                                    _selectedTheme = theme;
                                  });
                                },
                                selectedColor: Colors.purple.shade200,
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 20),
                  
                  // Prompt display
                  Expanded(
                    child: Card(
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Center(
                          child: Text(
                            _currentPrompt,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w500,
                              color: _isTruth ? Colors.blue.shade800 : Colors.red.shade800,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 30),
                  
                  // Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => _generatePrompt(true),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text(
                            "TRUTH",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => _generatePrompt(false),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                          ),
                          ),
                          child: const Text(
                            "DARE",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          // Confetti animation
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              shouldLoop: false,
              colors: const [
                Colors.green,
                Colors.blue,
                Colors.pink,
                Colors.orange,
                Colors.purple,
              ],
            ),
          ),
        ],
      ),
    );
  }
}