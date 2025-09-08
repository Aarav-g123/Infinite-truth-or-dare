// main.dart
import 'package:flutter/material.dart';
import 'home_screen.dart';

void main() {
  runApp(const TruthOrDareApp());
}

class TruthOrDareApp extends StatelessWidget {
  const TruthOrDareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TruthDare AI',
      theme: ThemeData(
        primarySwatch: Colors.purple,
        visualDensity: VisualDensity.adaptivePlatformDensity,
        useMaterial3: true,
      ),
      home: const HomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}