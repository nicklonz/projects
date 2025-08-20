# safe_eval.py
"""
Safe arithmetic evaluator using Python's AST.

Allowed:
  - numeric literals (int/float)
  - parentheses
  - binary operators: + - * / // % **
  - unary operators: + -

Everything else raises ValueError.
"""

import ast
import operator as op
from typing import Union

# Binary and unary operator tables
_BIN = {
    ast.Add: op.add,
    ast.Sub: op.sub,
    ast.Mult: op.mul,
    ast.Div: op.truediv,
    ast.FloorDiv: op.floordiv,
    ast.Mod: op.mod,
    ast.Pow: op.pow,
}

_UNARY = {
    ast.UAdd: op.pos,
    ast.USub: op.neg,
}

Number = Union[int, float]

def _eval(node: ast.AST) -> Number:
    if isinstance(node, ast.Expression):
        return _eval(node.body)
    if isinstance(node, ast.BinOp):
        left = _eval(node.left)
        right = _eval(node.right)
        fn = _BIN.get(type(node.op))
        if fn is None:
            raise ValueError("Unsupported operator")
        # Guard divide/mod by zero
        if fn in (op.truediv, op.floordiv, op.mod) and right == 0:
            raise ZeroDivisionError("Division by zero")
        return fn(left, right)
    if isinstance(node, ast.UnaryOp):
        fn = _UNARY.get(type(node.op))
        if fn is None:
            raise ValueError("Unsupported unary operator")
        return fn(_eval(node.operand))
    # Python 3.8+: Constant covers numbers; 3.7 and older use Num
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError("Only numeric literals allowed")
    if hasattr(ast, "Num") and isinstance(node, ast.Num):  # compat
        return node.n
    # Disallow names, calls, attributes, etc.
    raise ValueError(f"Unsupported expression: {type(node).__name__}")

def evaluate(expr: str) -> Number:
    """
    Parse and evaluate a safe arithmetic expression.
    """
    if not isinstance(expr, str):
        raise ValueError("Expression must be a string")
    try:
        tree = ast.parse(expr, mode="eval")
    except SyntaxError:
        raise ValueError("Invalid syntax")
    result = _eval(tree)
    if not isinstance(result, (int, float)):
        raise ValueError("Expression did not evaluate to a number")
    return result
