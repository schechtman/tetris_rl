//
// Created by Nicolas on 07/12/16.
//

#ifndef TETRIS_RL_PIECE_H
#define TETRIS_RL_PIECE_H


class Piece {
private:
    int _shape;
public:
    Piece();
    ~Piece();
    // Rotation anti-horaire
    void Rotate(int nb_rotations);
    int GetShape(void);

};

#endif //TETRIS_RL_PIECE2_H
